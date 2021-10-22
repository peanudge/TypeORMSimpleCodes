module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "jiho",
  password: "1q2w3e4r",
  database: "test",
  synchronize: true,
  logging: false,

  migrationRun: true, // automatically run migrations before the tests
  dropSchema: true, // delete your data after the tests

  entities: ["src/entity/*.ts"],
  migrations: ["src/database/migrations/*.ts"],
  cli: {
    entitiesDir: "src/database/entities",
    migrationDir: "src/database/migrations",
  },
};
