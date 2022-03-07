import dotenv from 'dotenv';

dotenv.config();

export class Config {
  databases = {
    main: {
      uri: process.env.DB_MAIN || 'postgresql://postgres:qwe123@localhost:6432/main',
      pool_size: parseInt(process.env.DB_MAIN_POOL_SIZE || '10') || 10,
    },
  };
  nats = {
    uri: process.env.NATS || 'localhost:6222',
    timeout: parseInt(process.env.API_TIMEOUT || '5000') || 5000,
  };
  sessions = {
    uri: process.env.SESSIONS || 'localhost:7001',
    admin_key: process.env.SESSIONS_ADMIN_KEY,
  };
  telegram = {
    bot_token: process.env.BOT_TOKEN,
    bot_host: process.env.BOT_HOST,
    bot_port: parseInt(process.env.BOT_PORT || '0') || 8443,
    bot_cert_file: process.env.BOT_CERT_FILE || 'dev_bot.pem',
    bot_key_file: process.env.BOT_KEY_FILE || 'dev_bot.key',
  };
}

export default new Config();
