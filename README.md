# Gate Marches character tracker

This is an experience and level tracker specific to the Dungeons & Dragons
campaign. Because why would you spent seconds fiddling with paper if you could
write a webapp instead?

## Building and running

All dependencies are managed using
[Pipenv](https://pipenv.readthedocs.io/en/latest/) and the back end relies on a
PostgreSQL server. By default the application uses the included [Docker
Compose](https://docs.docker.com/compose/) configuration. To the dependencies
and run the application, simply run:

```shell
docker-compose up -d
yarn build
# Alternatively:
#   - `yarn dev` for a quicker build without optimizations
#   - `yarn watch` for a development server with hot reloading
pipenv run ./manage.py migrate
pipenv run ./manage.py runserver
```
