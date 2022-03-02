import dotenv from 'dotenv'

dotenv.config()

export class Config {
  databases = {
    main: {
      uri: process.env.DB_MAIN || "postgresql://postgres:qwe123@localhost:6432/main",
      pool_size: parseInt(process.env.DB_MAIN_POOL_SIZE || "10") || 10
    }
  }
  nats = {
    uri: process.env.NATS || "localhost:6222",
    timeout: parseInt(process.env.API_TIMEOUT || "5000") || 5000
  }
  sessions = {
    uri: process.env.SESSIONS || "localhost:7001",
  }
}

export default new Config()