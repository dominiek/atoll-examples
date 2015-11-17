DOCKER_BUILD_OPTS=--no-cache=false
DOCKER_HOST_IP=`boot2docker ip`
DOCKER_RUN_OPTS=--add-host=api.atoll.io:192.168.59.3 --dns=172.17.42.1
DOCKER_NAMESPACE=web-app-large

all:
	exec boot2docker shellinit
	docker build $(DOCKER_BUILD_OPTS) -t $(DOCKER_NAMESPACE)/api api
	docker build $(DOCKER_BUILD_OPTS) -t $(DOCKER_NAMESPACE)/app app
	docker build $(DOCKER_BUILD_OPTS) -t $(DOCKER_NAMESPACE)/mongodb mongodb
	docker build $(DOCKER_BUILD_OPTS) -t $(DOCKER_NAMESPACE)/elasticsearch elasticsearch
	docker build $(DOCKER_BUILD_OPTS) -t $(DOCKER_NAMESPACE)/worker worker


clean:
	-docker rmi `docker images -q`

stop:
	-docker rm -f "consul"
	-docker rm -f "registrator"
	-docker rm -f "0.mongodb"
	-docker rm -f "1.mongodb"
	-docker rm -f "2.mongodb"
	-docker rm -f "0.api"
	-docker rm -f "1.api"
	-docker rm -f "0.app"
	-docker rm -f "1.app"
	-docker rm -f "0.elasticsearch"
	-docker rm -f "1.elasticsearch"
	-docker rm -f "0.worker"
	-docker rm -f "1.worker"

run:
	make stop
	docker run -d \
		-p 8400:8400 \
		-p 8500:8500 \
		-p 53:53/udp \
		-h consul-server-node \
		--name consul \
		progrium/consul \
			-server \
			-bootstrap
	docker run -d \
		--link consul:consul \
		--name registrator \
		-h "Triggerfish.local" \
		-v /var/run/docker.sock:/tmp/docker.sock \
		gliderlabs/registrator:latest \
			-internal \
			consul://consul:8500
	docker run -d $(DOCKER_RUN_OPTS) -p 24017:27017 --name "0.mongodb" -e "SERVICE_TAGS=master,0" -h "0.mongodb.service.consul" -t $(DOCKER_NAMESPACE)/mongodb
	docker run -d $(DOCKER_RUN_OPTS) --name "1.mongodb" -e "SERVICE_TAGS=master,1" -h "1.mongodb.service.consul" -t $(DOCKER_NAMESPACE)/mongodb
	docker run -d $(DOCKER_RUN_OPTS) --name "2.mongodb" -e "SERVICE_TAGS=arbiter,2" -h "arbiter.mongodb.service.consul" -t $(DOCKER_NAMESPACE)/mongodb
	echo 'rs.initiate()' | mongo --host $(DOCKER_HOST_IP) --port 24017
	docker run -d $(DOCKER_RUN_OPTS) --name "0.elasticsearch" -e "SERVICE_TAGS=0" -t $(DOCKER_NAMESPACE)/elasticsearch
	docker run -d $(DOCKER_RUN_OPTS) --name "1.elasticsearch" -e "SERVICE_TAGS=1" -t $(DOCKER_NAMESPACE)/elasticsearch
	docker run -d $(DOCKER_RUN_OPTS) --name "0.worker" -e "SERVICE_TAGS=0" -t $(DOCKER_NAMESPACE)/worker
	docker run -d $(DOCKER_RUN_OPTS) --name "1.worker" -e "SERVICE_TAGS=1" -t $(DOCKER_NAMESPACE)/worker
	docker run -d $(DOCKER_RUN_OPTS) --name "0.api" -e "SERVICE_TAGS=0" -t $(DOCKER_NAMESPACE)/api
	docker run -d $(DOCKER_RUN_OPTS) --name "1.api" -e "SERVICE_TAGS=1" -t $(DOCKER_NAMESPACE)/api
	docker run -d $(DOCKER_RUN_OPTS) --name "0.app" -e "SERVICE_TAGS=0" -t $(DOCKER_NAMESPACE)/app
	docker run -d $(DOCKER_RUN_OPTS) --name "1.app" -e "SERVICE_TAGS=1" -t $(DOCKER_NAMESPACE)/app
	sleep 10
	echo 'rs.add("1.mongodb.service.consul:27017")' | mongo --host $(DOCKER_HOST_IP) --port 24017
	echo 'rs.addArb("arbiter.mongodb.service.consul:27017")' | mongo --host $(DOCKER_HOST_IP) --port 24017
