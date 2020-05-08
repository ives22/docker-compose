# prometheus+grafana+pushgateway+alertmanager

## 1 将prometheus配置文件里面的IP改为自己节点的IP

```shell
# cat prometheus/prometheus.yaml 
...
scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['10.10.10.21:9090']
        labels:
          instance: prometheus
                  
  - job_name: alertmanagers
    static_configs:
      - targets: ["10.10.10.21:9093"]
        labels:
          instance: alertmanagers
                  
  - job_name: pushgateway
    static_configs:
      - targets: ['10.10.10.21:9091']
        labels:
          instance: pushgateway
```

## 2 创建grafana数据目录

```
mkdir ./data/grafana
chown 472:472 ./data/grafana
```



```
启动
docker-compose up -d

停止
docker-compose down

```

## 3 访问地址

```
Prometheus:   http://localhost:9090
Grafana:      http://localhost:3000  \(User\: admin / Password\: admin@123\)
Pushgateway:  http://localhost:9091
Alertmanager: http://localhost:9093
```



## 4 测试数据

```
echo "some_metric 3.14" | curl --data-binary @- http://10.10.10.21:9091/metrics/job/some_job
```

