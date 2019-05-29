# Gate Marches character tracker

This is an experience and level tracker specific to the Gate Marches Dungeons &
Dragons campaign. Because why would you spent seconds fiddling with paper if you
could write a web app instead?

## Building and running

All Python dependencies are managed using
[Pipenv](https://pipenv.readthedocs.io/en/latest/). The back end relies on a
PostgreSQL server. By default the development configuration uses server from the
included [Docker Compose](https://docs.docker.com/compose/) configuration. To
install the dependencies and run the application, simply run:

```shell
docker-compose up -d
yarn build
# Or alternatively:
#   - `yarn dev` for a quicker build without optimizations
#   - `yarn watch` for a development server with hot reloading

pipenv run ./manage.py migrate
pipenv run ./manage.py runserver
```

### Settings

The application uses Google's OAuth2 endpoints for authentication by default. To
set this up, you will have to add your client ID and secret key to
`dungeonesis/settings/local.py`:

```python
SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = "<client_id>"
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = "<client_secret>"
```

These keys can be aqcuired by creating an OAuth Client ID through Google's [API
console](https://console.developers.google.com/apis/credentials). You should
allow the following authorized redirect URLs for local development:

- `http://localhost:8000/complete/google-oauth2/`
- `http://localhost:9000/complete/google-oauth2/`
