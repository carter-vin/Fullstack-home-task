IMAGE_NAME = plasmid-sequence-analysis-api

.PHONY: build run clean

build:
	docker build -t $(IMAGE_NAME) .

app:
	docker run -p 5000:5000 $(IMAGE_NAME)

clean:
	docker stop $$(docker ps -aq --filter ancestor=$(IMAGE_NAME))
	docker rm $$(docker ps -aq --filter ancestor=$(IMAGE_NAME))
	docker rmi $(IMAGE_NAME)
