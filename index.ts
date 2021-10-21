import "reflect-metadata"; // for using meta-data

import { createConnection } from "typeorm";
import { Photo } from "./src/entity/Photo";

import { getConnection } from "./src/connect";

// Entity Manager
getConnection().then(async (connection) => {
  console.log("연결상태: ", connection.isConnected);

  let photo = new Photo();
  photo.name = "ME and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;

  await connection.manager.save(photo);
  console.log("Photo has been saved");

  let savedPhotos = await connection.manager.find(Photo);
  console.log("All photos from the db: ", savedPhotos);
});

// using Repositories
getConnection()
  .then(async (connection) => {
    let photo = new Photo();
    photo.name = "ME and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    let photoRepository = connection.getRepository(Photo);
    await photoRepository.save(photo);
    console.log("Photo has been saved.");

    let savedPhotos = await photoRepository.find();
    console.log("All photos from the db: ", savedPhotos);

    let firstPhoto = await photoRepository.findOne(1); // id: 1
    console.log("ID is 1 : ", firstPhoto);

    let meAndBearsPhoto = await photoRepository.findOne({
      name: "ME and Bears",
    });
    console.log("Me and Bears photo from the db: ", meAndBearsPhoto);

    let allViewedPhotos = await photoRepository.find({ views: 1 });
    console.log("All viewed photos: ", allViewedPhotos);

    let allPublishedPhotos = await photoRepository.find({ isPublished: true });
    console.log("Published photos: ", allPublishedPhotos);

    let [allPhotos, photosCount] = await photoRepository.findAndCount();
    console.log("All photos: ", allPhotos);
    console.log("Photos count: ", photosCount);

    // Updating in the database
    let photoToUpdate = await photoRepository.findOne(1);
    if (photoToUpdate) {
      photoToUpdate.name = "Me, my friends and polar bears";
      await photoRepository.save(photoToUpdate);
    }
  })
  .catch((error) => console.log(error));
