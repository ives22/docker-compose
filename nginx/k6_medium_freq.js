import http from 'k6/http';
import { Counter, Rate } from 'k6/metrics';

const limitedRequests = new Counter('limited_requests');
const normalRequests = new Counter('normal_requests');
const errorRequests = new Counter('error_requests');
const successRate = new Rate('success_rate');

export let options = {
    scenarios: {
        // // 方案1：短时间高并发测试（适合验证限流是否生效）
        // burst_test: {
        //     executor: 'shared-iterations',
        //     vus: 20,               // 20个并发用户
        //     iterations: 50,        // 总共50次请求
        //     maxDuration: '2s',     // 2秒内完成
        // },

        // 方案2：长时间测试（适合观察时间窗口内的限流效果）
        long_test: {
            executor: 'constant-arrival-rate',
            rate: 2,              // 每秒2个请求
            timeUnit: '1s',
            duration: '70s',      // 超过1分钟，观察限流窗口
            preAllocatedVUs: 5,
            maxVUs: 10,
        },

        // 方案3：阶段式测试
        // stages_test: {
        //     executor: 'ramping-arrival-rate',
        //     startRate: 1,
        //     timeUnit: '1s',
        //     preAllocatedVUs: 10,
        //     maxVUs: 30,
        //     stages: [
        //         { target: 5, duration: '5s' },   // 前5秒增加到5req/s
        //         { target: 5, duration: '30s' },  // 保持30秒
        //         { target: 10, duration: '10s' }, // 增加到10req/s
        //         { target: 1, duration: '25s' },  // 降低到1req/s
        //     ],
        // },
    },
};

let testStartTime = Date.now();
let requestSequence = 0;

export default function () {
    requestSequence++;
    const headers = {
        'Authorization': 'auth/aabbcc/2024',
    };

    const elapsedTime = (Date.now() - testStartTime) / 1000;

    let res;
    try {
        res = http.get('http://limit.tnginx.org/medium_freq/', {
            headers: headers,
            timeout: '5s'
        });

        console.log(`[${requestSequence.toString().padStart(3)}] T+${elapsedTime.toFixed(1)}s | 状态码: ${res.status} | 响应时间: ${res.timings.duration}ms`);

        if (res.status === 429) {
            limitedRequests.add(1);
            successRate.add(0);  // 限流视为失败（因为期望是200）
        } else if (res.status === 200) {
            normalRequests.add(1);
            successRate.add(1);  // 正常通过
        } else {
            errorRequests.add(1);
            successRate.add(0);
            console.log(`❌ 异常状态码: ${res.status}，响应: ${res.body.substring(0, 100)}`);
        }

    } catch (e) {
        errorRequests.add(1);
        successRate.add(0);
        console.log(`💥 请求异常: ${e.message}`);
    }
}

export function handleSummary(data) {
    const totalReqs = data.metrics.http_reqs ? data.metrics.http_reqs.values.count : 0;
    const rate = data.metrics.http_reqs ? data.metrics.http_reqs.values.rate : 0;
    const limited = data.metrics.limited_requests ? data.metrics.limited_requests.values.count : 0;
    const normal = data.metrics.normal_requests ? data.metrics.normal_requests.values.count : 0;
    const errors = data.metrics.error_requests ? data.metrics.error_requests.values.count : 0;
    const success = data.metrics.success_rate ? data.metrics.success_rate.values.rate : 0;

    console.log('\n' + '='.repeat(60));
    console.log('⏰ 1分钟1次限流测试结果分析');
    console.log('='.repeat(60));

    console.log(`📊 基本统计:`);
    console.log(`   总请求数: ${totalReqs}`);
    console.log(`   实际请求速率: ${rate.toFixed(2)} req/s`);
    console.log(`   测试时长: ${(data.state.testDuration / 1000000000).toFixed(1)}s`);

    console.log(`\n🎯 响应分布:`);
    console.log(`   ✅ 200正常通过: ${normal} 次 (${totalReqs > 0 ? (normal / totalReqs * 100).toFixed(1) : 0}%)`);
    console.log(`   🚫 429触发限流: ${limited} 次 (${totalReqs > 0 ? (limited / totalReqs * 100).toFixed(1) : 0}%)`);
    console.log(`   ❌ 其他错误: ${errors} 次 (${totalReqs > 0 ? (errors / totalReqs * 100).toFixed(1) : 0}%)`);


    if (normal === 0) {
        console.log(`\n🔴 警告: 没有200响应！`);
        console.log(`   对于1分钟1次的限流:`);
        console.log(`   - 如果测试时间<60秒，可能只有1个请求应该通过`);
        console.log(`   - 如果测试时间>60秒，应该至少有${expectedPassed}个请求通过`);
        console.log(`   建议:`);
        console.log(`   1. 延长测试时间到70秒以上`);
        console.log(`   2. 检查nginx配置是否是1r/m`);
        console.log(`   3. 检查burst参数是否过小`);
    } else if (normal === 1 && testDurationSeconds < 60) {
        console.log(`\n🟢 正常: 测试时间${testDurationSeconds.toFixed(1)}秒，通过1个请求，符合1r/m限流`);
    } else if (normal === expectedPassed || normal === expectedPassed - 1) {
        console.log(`\n🟢 正常: 通过数${normal}接近期望值${expectedPassed}，限流工作正常`);
    } else if (normal > expectedPassed) {
        console.log(`\n🟡 注意: 通过数${normal}超过期望值${expectedPassed}`);
        console.log(`   可能原因:`);
        console.log(`   1. 限流配置不是1r/m`);
        console.log(`   2. burst参数过大`);
        console.log(`   3. 不同VU使用了不同的Authorization值`);
    } else if (normal < expectedPassed) {
        console.log(`\n🟡 注意: 通过数${normal}少于期望值${expectedPassed}`);
        console.log(`   可能原因:`);
        console.log(`   1. 所有请求瞬间并发，超出burst容量`);
        console.log(`   2. 限流过于严格`);
        console.log(`   3. 请求分布不均`);
    }

    console.log(`\n💡 测试建议:`);
    console.log(`   1. 使用不同Authorization值测试: 每个用户有自己的限流桶`);
    console.log(`   2. 延长测试时间: 至少70秒以观察跨分钟限流`);
    console.log(`   3. 查看nginx日志: 确认ak_id提取和限流状态`);

    console.log('\n' + '='.repeat(60));
}

// 可选：添加一个setup函数来记录测试开始时间
export function setup() {
    testStartTime = Date.now();
    console.log(`🚀 开始1分钟1次限流测试`);
    console.log(`📌 测试端点: http://limit.tnginx.org:8880/medium_freq/`);
    console.log(`📌 Authorization: auth/aabbcc/2024`);
    console.log(`📌 预期限流: 1次/分钟`);
    console.log('='.repeat(60));
}