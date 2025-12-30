
# nginx 限流测试


基于ak_id
## 每个 ak_id 每秒 1 次请求, 压测脚本
```bash
❯ k6 run k6_high_freq.js

         /\      Grafana   /‾‾/
    /\  /  \     |\  __   /  /
   /  \/    \    | |/ /  /   ‾‾\
  /          \   |   (  |  (‾)  |
 / __________ \  |_|\_\  \_____/

     execution: local
        script: k6_high_freq.js
        output: -

     scenarios: (100.00%) 1 scenario, 20 max VUs, 35s max duration (incl. graceful stop):
              * high_load: 10.00 iterations/s for 5s (maxVUs: 10-20, gracefulStop: 30s)

INFO[0000] 📤 请求间隔: 1ms | 状态码: 200 | 响应时间: 5.668ms        source=console
INFO[0000] 📤 请求间隔: 101ms | 状态码: 200 | 响应时间: 2.241ms      source=console
INFO[0000] 📤 请求间隔: 201ms | 状态码: 429 | 响应时间: 1.898ms      source=console
INFO[0000] 📤 请求间隔: 301ms | 状态码: 429 | 响应时间: 2.829ms      source=console
INFO[0000] 📤 请求间隔: 403ms | 状态码: 429 | 响应时间: 2.414ms      source=console
INFO[0000] 📤 请求间隔: 501ms | 状态码: 429 | 响应时间: 2.636ms      source=console
INFO[0000] 📤 请求间隔: 601ms | 状态码: 429 | 响应时间: 2.484ms      source=console
INFO[0000] 📤 请求间隔: 701ms | 状态码: 429 | 响应时间: 2.257ms      source=console
INFO[0000] 📤 请求间隔: 801ms | 状态码: 429 | 响应时间: 3.779ms      source=console
INFO[0000] 📤 请求间隔: 901ms | 状态码: 429 | 响应时间: 2.706ms      source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.911ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 200 | 响应时间: 1.753ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.517ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.446ms     source=console
INFO[0001] 📤 请求间隔: 999ms | 状态码: 429 | 响应时间: 1.344ms      source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 2.599ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.436ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.305ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.492ms     source=console
INFO[0001] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.321ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.557ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 200 | 响应时间: 2.272ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.295ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.564ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.694ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.126ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.558ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 2.634ms     source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 13.811ms    source=console
INFO[0002] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 3.428ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.195ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 200 | 响应时间: 1.556ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 2.284ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.372ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.064ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.979ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 0.95ms      source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 0.928ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.695ms     source=console
INFO[0003] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.125ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.162ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 200 | 响应时间: 1.594ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.038ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.103ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.45ms      source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.949ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.054ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.491ms     source=console
INFO[0004] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 2.07ms      source=console
INFO[0004] 📤 请求间隔: 1005ms | 状态码: 429 | 响应时间: 4.858ms     source=console
INFO[0005] 📤 请求间隔: 1000ms | 状态码: 429 | 响应时间: 1.096ms     source=console
INFO[0005]
========== 详细测试结果 ==========                 source=console
INFO[0005] 总请求数: 51                                      source=console
INFO[0005] 实际请求速率: 10.20 req/s                           source=console
INFO[0005] 正常通过: 6 次 (11.8%)                             source=console
INFO[0005] 被限流:   45 次 (88.2%)                           source=console
INFO[0005] 错误请求: 0 次                                     source=console
INFO[0005] 成功率:   11.8%                                  source=console
INFO[0005]                                               source=console
INFO[0005] 📊 限流效果分析:                                     source=console
INFO[0005] ✅ 限流强烈生效！                                     source=console

```

