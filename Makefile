#	Utility commands

COMPOSE_SERVICE_NAME = nest-container



# clear temp files
clear:
	sudo find . -type d \( -name "node_modules" -or -name "dist" -or -name ".volumes" \) -prune -exec rm -rf {} \;

# setup optional docker environment
up:
	docker-compose up --detach
clean-up:
	docker-compose up --detach --build --force-recreate --always-recreate-deps
down:
	docker-compose down
clean-down:
	docker-compose down --rmi all --volumes --remove-orphans
sh:
	docker-compose exec --privileged $(COMPOSE_SERVICE_NAME) bash
bash:
	docker-compose exec --privileged $(COMPOSE_SERVICE_NAME) bash