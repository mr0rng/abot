# ABot

## Dev

### Requirements

- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)
- [nodejs](https://nodejs.org/en/) (it's better to install [nvm](https://github.com/nvm-sh/nvm))

### Init project

```bash
git clone project
npm i
npx lerna bootstrap
npm run build
npm run env
npm run migrate
```

Happy dev!

### Developing telegram bot

[Webhooks](https://core.telegram.org/bots/webhooks) are the preferred way to get event from telegram API.
For development setup, we use [ngrok](https://ngrok.com/)

1. Run ngrok container: `docker run --rm -p 4040:4040 --name telegram_bot_ngrok wernight/ngrok ngrok http host.docker.internal:8080`
2. Get the https endpoint of the tunnel: `curl $(docker port telegram_bot_ngrok 4040)/api/tunnels`
3. Set `BOT_TUNNEL=<tunnel>` and `BOT_PORT=8080` in `services/telegram/.env`
4. Run the bot `npx lerna run start --stream --scope @abot/telegram`
5. Monitor traffic at http://localhost:4040/

### Scripts

#### env:network

Create docker network if not exist.

#### env

Start dev environment.

#### env:down

Stop dev environment.

#### migrate

Apply migrations.

#### fixtures

Create test data in the database.

#### test

Run tests.

#### build

Build all packages.

### Env variables

| Variable          | Default value                                    |
|-------------------|--------------------------------------------------|
| DB_MAIN           | postgresql://postgres:qwe123@localhost:6432/main |
| DB_MAIN_POOL_SIZE | 10                                               |
| NATS              | localhost:6222                                   |
| API_TIMEOUT       | 5000                                             |
| SESSIONS          | localhost:7001                                   |
| BOT_TOKEN         |                                                  |
| BOT_HOST          |                                                  |
| BOT_PORT          | 8443                                             |
| BOT_CERT_SELF_SIGNED | false                                         |
| BOT_CERT_FILE     | dev_bot.pem                                      |
| BOT_KEY_FILE      | dev_bot.key                                      |
| BOT_TUNNEL        |                                                  |