VERSION=4

docker build . -t livekit/chrometester:latest
docker push livekit/chrometester:latest
docker tag livekit/chrometester:latest 203125320322.dkr.ecr.us-west-2.amazonaws.com/chrometester:$VERSION
docker push 203125320322.dkr.ecr.us-west-2.amazonaws.com/chrometester:$VERSION
