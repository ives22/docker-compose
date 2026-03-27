Redis 使用方式

# 添加单个 IP
SADD devops:ip_allowlist 192.168.1.100
SADD devops:ip_allowlist 10.20.30.40

# 添加 IP 段（CIDR 格式）
SADD devops:ip_allowlist 192.168.1.0/24
SADD devops:ip_allowlist 10.0.0.0/8
SADD devops:ip_allowlist 172.16.0.0/12

# 查看白名单
SMEMBERS devops:ip_allowlist

# 删除规则
SREM devops:ip_allowlist 192.168.1.0/24
