import "reflect-metadata"; // for using meta-data

import { createConnection } from "typeorm";
import { Photo } from "./src/entity/Photo";

import { getConnection } from "./src/connect";
import { PhotoMetadata } from "./src/entity/PhotoMetadata";
import { Author } from "./src/entity/Author";
import { Album } from "./src/entity/Album";

// // Entity Manager
// getConnection().then(async (connection) => {
//   console.log("연결상태: ", connection.isConnected);

//   let photo = new Photo();
//   photo.name = "ME and Bears";
//   photo.description = "I am near polar bears";
//   photo.filename = "photo-with-bears.jpg";
//   photo.views = 1;
//   photo.isPublished = true;

//   await connection.manager.save(photo);
//   console.log("Photo has been saved");

//   let savedPhotos = await connection.manager.find(Photo);
//   console.log("All photos from the db: ", savedPhotos);
// });

// // using Repositories
// getConnection()
//   .then(async (connection) => {
//     let photo = new Photo();
//     photo.name = "ME and Bears";
//     photo.description = "I am near polar bears";
//     photo.filename = "photo-with-bears.jpg";
//     photo.views = 1;
//     photo.isPublished = true;

//     let photoRepository = connection.getRepository(Photo);
//     await photoRepository.save(photo);
//     console.log("Photo has been saved.");

//     let savedPhotos = await photoRepository.find();
//     console.log("All photos from the db: ", savedPhotos);

//     let firstPhoto = await photoRepository.findOne(1); // id: 1
//     console.log("ID is 1 : ", firstPhoto);

//     let meAndBearsPhoto = await photoRepository.findOne({
//       name: "ME and Bears",
//     });
//     console.log("Me and Bears photo from the db: ", meAndBearsPhoto);

//     let allViewedPhotos = await photoRepository.find({ views: 1 });
//     console.log("All viewed photos: ", allViewedPhotos);

//     let allPublishedPhotos = await photoRepository.find({ isPublished: true });
//     console.log("Published photos: ", allPublishedPhotos);

//     let [allPhotos, photosCount] = await photoRepository.findAndCount();
//     console.log("All photos: ", allPhotos);
//     console.log("Photos count: ", photosCount);

//     // Updating in the database
//     let photoToUpdate = await photoRepository.findOne(1);
//     if (photoToUpdate) {
//       photoToUpdate.name = "Me, my friends and polar bears";
//       await photoRepository.save(photoToUpdate);
//     }
//   })
//   .catch((error) => console.log(error));

// Save a One to One relation
// getConnection()
//   .then(async (connection) => {
//     let photo = new Photo();
//     photo.name = "Me an Bears";
//     photo.description = "I am near polar bears";
//     photo.filename = "photo-with-bears.jpg";
//     photo.views = 1;
//     photo.isPublished = true;

//     // create a photo metadata
//     let metadata = new PhotoMetadata();
//     metadata.height = 650;
//     metadata.width = 480;
//     metadata.compressed = true;
//     metadata.comment = "cybershoot";
//     metadata.orientation = "portrait";
//     metadata.photo = photo; // Connect relation

//     let photoRepository = connection.getRepository(Photo);
//     let metadataRepository = connection.getRepository(PhotoMetadata);

//     await photoRepository.save(photo);

//     await metadataRepository.save(metadata);

//     console.log(
//       "Metadata is saved, and the relation between metadata and photo is created in the database too"
//     );
//   })
//   .catch((error) => console.log(error));

// relation result
// getConnection()
//   .then(async (connection) => {
//     const photoRepository = connection.getRepository(Photo);
//     let photo = await photoRepository.find({ relations: ["metadata"] });
//     // console.log("relation result", photo);

//     let photos = await photoRepository
//       .createQueryBuilder("photo")
//       .innerJoinAndSelect("photo.metadata", "metadata")
//       .getMany();

//     console.log("QueryBuild result : ", photos);
//   })
//   .catch((err) => console.log(err));

// getConnection()
//   .then(async (connection) => {
//     // create photo object

//     let author = new Author();
//     author.name = "user";

//     let photo = new Photo();
//     photo.name = "Me and Bears";
//     photo.description = "I am near polar bears";
//     photo.filename = "photo-with-bears.jpg";
//     photo.isPublished = true;
//     photo.views = 1;
//     photo.author = author;

//     // create photo metadata object
//     let metadata = new PhotoMetadata();
//     metadata.height = 640;
//     metadata.width = 480;
//     metadata.compressed = true;
//     metadata.comment = "cybershoot";
//     metadata.orientation = "portrait";

//     photo.metadata = metadata;

//     let photoRepository = connection.getRepository(Photo);
//     await photoRepository.save(photo);
//     console.log("Photo is saved, photo metadata is saved too");
//   })
//   .catch((err) => console.log(err));

// Insert ManytoMany record

getConnection().then(async (connection) => {
  const albumRepository = await connection.getRepository(Album);
  let album1 = new Album();
  album1.name = "Bears";

  await albumRepository.save(album1);

  let album2 = new Album();
  album2.name = "Me";
  await albumRepository.save(album2);

  let photo = new Photo();
  photo.name = "Me and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;
  photo.albums = [album1, album2];
  await connection.getRepository(Photo).save(photo);

  const loadedPhoto = await connection.manager
    .getRepository(Photo)
    .find({ relations: ["albums"] });

  console.log(loadedPhoto);
});
