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

### Scripts

#### env:network

Create docker network if not exist.

#### env

Start dev environment.

#### env:down

Stop dev environment.

#### migrate

Apply migrations.

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