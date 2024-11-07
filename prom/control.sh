#!/usr/bin/env bash

function yum_install_docker() {
    yum -y install yum-utils device-mapper-persistent-data lvm2
    yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    yum -y install docker-ce docker-ce-cli containerd.io
    
    mkdir -p /etc/docker /data/docker
    cat > /etc/docker/daemon.json<<EOF
{"data-root": "/data/docker"}
EOF
    
    systemctl enable docker --now
    systemctl status docker
    
    
    curl -L "https://dn-dao-github-mirror.daocloud.io/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
}

function install_docker(){
    ps -ef |grep docker > /dev/null
    if [ $? -ne 0 ]
    then
        if `rpm -aq |grep docker > /dev/null` 
        then
            echo "docker Already install..."
        else
           yum_install_docker 
        fi
    else
        echo "docker Already install..."
    fi
} 


function up_all() {
    prom_services=("influxdb" "prometheus" "pushgateway" "alertmanager" "grafana" "webhook")
    for service in ${prom_services[@]};do
        cd "system-"$service
        echo "trying to ${1} ${service}...";
        bash control.sh start
        sleep 2s
        cd ../
    done
}

function init() {
    docker network ls |grep prom > /dev/null
    if [ $? -ne 0 ]
    then
        docker network create prom
    fi
    for i in ./images/* 
    do
        if test -f $i
        then
            echo $i
            docker image load -i $i
        fi
    done
}

function start() {
    up_all
}

function stop() {
    prom_services=("influxdb" "prometheus" "pushgateway" "alertmanager" "grafana" "webhook")
    for service in ${prom_services[@]};do
        cd "system-"$service
        echo "trying to ${1} ${service}...";
        bash control.sh stop
        sleep 2s
        cd ../
    done
}

function restart() {
    prom_services=("influxdb" "prometheus" "pushgateway" "alertmanager" "grafana" "webhook")
    for service in ${prom_services[@]};do
        cd "system-"$service
        echo "trying to ${1} ${service}...";
        bash control.sh restart
        sleep 2s
        cd ../
    done
}

case $1 in
  install_docker)
    install_docker
    ;;
  init)
    init
    ;;
  start)
    start
    ;;
  stop)
    stop
    ;;
  restart)
    restart
    ;;
  *)
    echo "Usage $0 install_docker|init|start|stop|restart"
esac
