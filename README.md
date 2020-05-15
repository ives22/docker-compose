# prometheus+grafana+pushgateway+alertmanager

## 1 将prometheus配置文件里面的IP改为自己节点的IP

```shell
# cat prometheus/prometheus.yaml 
scrape_configs:
  - job_name: "prometheus-gather"
    static_configs:
      - targets:
        - 192.168.3.97:9090
        - 192.168.3.97:9091
        - 192.168.3.97:3000

#说明：
9090:prometheus
9090:pushgateway
3000:grafana
```

## 2 执行init脚本，添加grafana数据目录及修改权限

```
bash ./init.sh
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
echo "some_metric 3.14" | curl --data-binary @- http://localhost:9091/metrics/job/some_job

#登陆pushgateway进行查看会有一条数据 job="some_job"
```

