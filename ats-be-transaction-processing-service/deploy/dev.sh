#!/bin/bash
set -e

aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 621777793587.dkr.ecr.eu-central-1.amazonaws.com
docker build -t transactions ./
docker tag transactions:latest 621777793587.dkr.ecr.eu-central-1.amazonaws.com/transactions:v1.0.0
docker push 621777793587.dkr.ecr.eu-central-1.amazonaws.com/transactions:v1.0.0
aws ecs update-service --cluster ats-dev-ECSCluster-PrrmjyR2P2ID --service transactions --force-new-deployment