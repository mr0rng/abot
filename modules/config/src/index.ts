import dotenv from 'dotenv'

dotenv.config()

export class Config {
  databases = {
    main: {
      uri: process.env.DB_MAIN || "postgresql://postgres:qwe123@localhost:6432/main",
      pool_size: parseInt(process.env.DB_MAIN_POOL_SIZE || "10") || 10
    }
  }
  nats = process.env.NATS || "localhost:6222"
}

export default new Config()