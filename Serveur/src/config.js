import { resolve } from "node:path"

const config = {
  port: 3001,
  db: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "root",
      database: "api_rest",
    },
    useNullAsDefault: true,
    migrations: {
      directory: resolve("./src/db/migrations"),
      stub: resolve("./src/db/migration.stub"),
    },
  },
  security: {
    session: {
      jwt: {
        secret: "dicjoippV852096164FD4641SDC6C41SD6V4DS6V4SD6V1SD98V4SD",
        expiresIn: "1 day",
      },
      password: {
        saltlen: 32,
        iterations: 123943,
        keylen: 256,
        digest: "sha512",
      },
    },
  },
  pagination: {
    limit: {
      min: 1,
      max: 100,
      default: 10,
    },
  },
}

export default config
