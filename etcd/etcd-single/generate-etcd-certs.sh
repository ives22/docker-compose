#!/bin/bash

CERT_DIR="./certs"
mkdir -p "${CERT_DIR}"
cd "${CERT_DIR}"

# 1. 生成 CA 私钥和证书
openssl genrsa -out ca.key 4096
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 \
  -subj "/CN=etcd-ca" \
  -out ca.crt

# 2. 生成服务器私钥
openssl genrsa -out server.key 4096

# 3. 生成服务器证书签名请求（CSR）
openssl req -new -key server.key \
  -subj "/CN=etcd" \
  -out server.csr

# 4. 创建 server.ext 文件，指定 SAN（适配 Docker 中的 etcd 容器名）
cat > server.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
extendedKeyUsage = serverAuth, clientAuth
subjectAltName = @alt_names

[alt_names]
DNS.1 = etcd
DNS.2 = localhost
IP.1 = 127.0.0.1
EOF

# 5. 使用 CA 证书签发服务器证书
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out server.crt -days 3650 -sha256 -extfile server.ext

# -------- 客户端证书生成 --------

# 6. 生成客户端私钥
openssl genrsa -out client.key 4096

# 7. 创建客户端 CSR
openssl req -new -key client.key \
  -subj "/CN=etcd-client" \
  -out client.csr

# 8. 创建 client.ext 文件
cat > client.ext <<EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth
EOF

# 9. 使用 CA 证书签发客户端证书
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key \
  -CAcreateserial -out client.crt -days 3650 -sha256 -extfile client.ext

# 10. 清理中间文件
rm server.csr server.ext client.csr client.ext ca.srl

echo "✅ 所有证书已生成在 ${CERT_DIR} 目录下"
