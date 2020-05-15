#!/bin/bash
#给grafana数据目录修改权限

mkdir ./data/grafana -p
chown 472:472 ./data/grafana/ -R 
