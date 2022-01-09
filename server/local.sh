docker stop intercom-server
docker rm intercom-server
#docker image prune -a -f

docker build -t intercom-server .
docker run --name=intercom-server  -p 8098:8098 -p 8099:8099 intercom-server
