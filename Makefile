PATH_YML = -f ./srcs/docker-compose.yml
# PATH_DATA = /home/login/data
DC = docker compose $(PATH_YML)

all: up

up: down
	@$(DC) up -d

down:
	@$(DC) down

cup: down
	@$(DC) --build -d

cdown:
	$(DC) down -v --remove-orphans

build: cdown
	@$(DC) build --no-cache

re: fclean build up

log:
	$(DC) logs frontend

fclean: cdown
	sudo docker volume rm -f transcendence_DB_data
	sudo docker volume rm -f transcendence_BE_app
	sudo docker volume rm -f transcendence_FE_app
	sudo docker system prune -a --volumes -f

# sclean: fclean
#	sudo -k rm -rf $(PATH_DATA)/*
#	sudo mkdir -p $(PATH_DATA)

.PHONY: all up down cup cdown build re log fclean