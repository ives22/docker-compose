
## 生成证书
```
bash generate-etcd-certs.sh
```


## 启动容器
```
docker-compose up -d
```


## 验证
### 容器内验证
```
docker compose exec Etcd etcdctl \
  --endpoints=https://localhost:2379 \
  --cacert=/opt/bitnami/etcd/certs/ca.crt \
  --cert=/opt/bitnami/etcd/certs/server.crt \
  --key=/opt/bitnami/etcd/certs/server.key \
  endpoint health

# 输出如下结果表示ok
https://localhost:2379 is healthy: successfully committed proposal: took = 28.537083ms

```

### 容器外（mac）上验证
```
# 1. 安装客户端工具
brew install etcd

# 2. 验证
etcdctl \
  --endpoints=https://localhost:2379 \
  --cacert=certs/ca.crt \
  --cert=certs/client.crt \
  --key=certs/client.key \
  endpoint health


etcdctl \
  --endpoints=https://localhost:2379 \
  --cacert=certs/ca.crt \
  --cert=certs/client.crt \
  --key=certs/client.key \
  member list
```


