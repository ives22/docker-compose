import http from 'k6/http';

export let options = {
    scenarios: {
        burst_test: {
            executor: 'shared-iterations',
            vus: 50,
            iterations: 100,
            maxDuration: '5s',
        },
    },
};

export default function () {
    const headers = {
        Authorization: 'auth/aabbcc/2024',
    };

    const params = {
        headers: headers,
        timeout: '5s',
    };

    let res = http.post(
        'http://operatorapi.joyaras.com/api/v1/jackpot',
        null,
        params
    );

    console.log(
        `状态码: ${res.status} | 响应时间: ${res.timings.duration}ms`
    );
}