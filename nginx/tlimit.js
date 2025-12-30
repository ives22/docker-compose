import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    // 方案1：瞬间高并发触发限流
    scenarios: {
        burst_test: {
            executor: 'shared-iterations',
            vus: 50,          // 50个并发用户同时启动
            iterations: 100,  // 总共100次请求
            maxDuration: '5s',
        },
    },
};

export default function () {
    const headers = {
        'Authorization': 'auth/aabbcc/2024',
    };

    // 测试每秒限流
    let res = http.get('http://limit.tnginx.org:8880/api/high_freq', {
        headers: headers,
        timeout: '5s'
    });

    // 打印详细响应信息
    console.log(`状态码: ${res.status} | ak_id头: ${res.headers['X-Ak-Id']} | 限流区域: ${res.headers['X-Limit-Zone']}`);

    // 为了看到限流效果，可以在请求之间稍微延迟
    // sleep(0.01);
}