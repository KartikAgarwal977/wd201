#! /bin/bash
set -x
CT=akstodo3-dns-ziqigtr4.hcp.eastasia.azmk8s.io/todo-web
docker build -t $CT
docker push $CT