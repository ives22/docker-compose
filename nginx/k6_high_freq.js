import http from 'k6/http';
import { Counter, Rate } from 'k6/metrics';

const limitedRequests = new Counter('limited_requests');
const normalRequests = new Counter('normal_requests');
const errorRequests = new Counter('error_requests');
const successRequest = new Counter('success_requests');
const successRate = new Rate('success_rate');

let lastRequestTime = Date.now();

export let options = {
    scenarios: {
        high_load: {
            executor: 'constant-arrival-rate',
            rate: 10,           // 每秒 10 个请求，远超过 1r/s
            timeUnit: '1s',
            duration: '5s',
            preAllocatedVUs: 10,
            maxVUs: 20,
        },
    },
};

export default function () {
    const headers = {
        'Authorization': 'auth/aabbcc/2024',
    };

    // 记录请求间隔
    const now = Date.now();
    const interval = now - lastRequestTime;
    lastRequestTime = now;

    let res;
    try {
        res = http.get('http://limit.tnginx.org/high_freq/', {
            headers: headers,
            timeout: '5s'
        });

        // 打印详细请求信息
        console.log(`📤 请求间隔: ${interval}ms | 状态码: ${res.status} | 响应时间: ${res.timings.duration}ms`);
        
        if (res.status === 429) {
            limitedRequests.add(1);
            successRate.add(0);
        } else if (res.status === 200) {
            normalRequests.add(1);
            successRate.add(1);
        } 
        else {
            errorRequests.add(1);
            successRate.add(0);
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

    console.log('\n========== 详细测试结果 ==========');
    console.log(`总请求数: ${totalReqs}`);
    console.log(`实际请求速率: ${rate.toFixed(2)} req/s`);
    console.log(`正常通过: ${normal} 次 (${totalReqs > 0 ? (normal / totalReqs * 100).toFixed(1) : 0}%)`);
    console.log(`被限流:   ${limited} 次 (${totalReqs > 0 ? (limited / totalReqs * 100).toFixed(1) : 0}%)`);
    console.log(`错误请求: ${errors} 次`);
    console.log(`成功率:   ${(success * 100).toFixed(1)}%`);
    console.log('');

    console.log('📊 限流效果分析:');
    if (limited === 0) {
        console.log('❌ 限流未触发！可能原因:');
        console.log('   1. 实际请求速率太低（当前: ' + rate.toFixed(2) + ' req/s）');
        console.log('   2. nginx burst 参数过大（当前: burst=1）');
        console.log('   3. 多个 VU 共享相同 ak_id，但请求间隔足够长');
    } else if (limited / totalReqs > 0.8) {
        console.log('✅ 限流强烈生效！');
    } else if (limited / totalReqs > 0.3) {
        console.log('⚠️  限流部分生效');
    } else {
        console.log('⚠️  限流轻微生效');
    }

    // 输出建议
    console.log('\n💡 调整建议:');
    if (rate < 10) {
        console.log('   增加 rate 参数到 100 以上');
        console.log('   增加 preAllocatedVUs 到 200 以上');
    }
    if (limited === 0 && rate > 10) {
        console.log('   检查 nginx burst 参数是否过大');
        console.log('   确认 limit_req 配置位置是否正确');
    }
}