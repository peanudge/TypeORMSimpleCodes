import { Connection, createConnection } from "typeorm";
import { Album } from "./entity/Album";
import { Author } from "./entity/Author";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";

export const getConnection = async (): Promise<Connection> => {
  try {
    return await createConnection({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "jiho",
      password: "1q2w3e4r",
      database: "test",
      entities: [Photo, PhotoMetadata, Author, Album],
      synchronize: true,
      logging: false,
    });
  } catch (err) {
    console.log(err);
    throw new Error();
  }
};
