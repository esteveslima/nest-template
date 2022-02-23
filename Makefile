#	Utility commands to setup local development environment

COMPOSE_FILE_PATH = ./assets/environment/docker-compose.yml
COMPOSE_SERVICE_NAME = nest-container



# clear temp files
clear:
	sudo find . -type d \( -name "node_modules" -or -name "dist" -or -name ".volumes" \) -prune -exec rm -rf {} \;

# setup optional docker environment
up:
	docker-compose --file $(COMPOSE_FILE_PATH) up --detach
clean-up:
	docker-compose --file $(COMPOSE_FILE_PATH) up --detach --build --force-recreate --always-recreate-deps
down:
	docker-compose --file $(COMPOSE_FILE_PATH) down
clean-down:
	docker-compose --file $(COMPOSE_FILE_PATH) down --rmi all --volumes --remove-orphans

rebuild:
	make down && make up

sh:
	docker-compose --file $(COMPOSE_FILE_PATH) exec --privileged $(COMPOSE_SERVICE_NAME) bash
bash:
	docker-compose --file $(COMPOSE_FILE_PATH) exec --privileged $(COMPOSE_SERVICE_NAME) bash