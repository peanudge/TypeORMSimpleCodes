import { Connection, createConnection } from "typeorm";
import { Photo } from "./entity/Photo";

export const getConnection = async (): Promise<Connection> => {
  try {
    return await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "jiho",
      password: "1q2w3e4r",
      database: "test",
      entities: [Photo],
      synchronize: true,
      logging: false,
    });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
