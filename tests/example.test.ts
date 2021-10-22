import { getConnection } from "typeorm";
import { Author } from "../src/entity/Author";
import { Photo } from "../src/entity/Photo";
import { PhotoMetadata } from "../src/entity/PhotoMetadata";
import "./connection";

it("create a photo", async () => {
  const connection = getConnection();
  const photoRepository = connection.getRepository(Photo);

  let photo = new Photo();
  photo.name = "ME and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;

  await photoRepository.save(photo);

  let savedPhotos = await photoRepository.find();
  expect(savedPhotos.length).toBe(1);
  let savedPhoto = savedPhotos[0];
  expect(savedPhoto).toEqual({
    id: 1,
    name: "ME and Bears",
    description: "I am near polar bears",
    views: 1,
    isPublished: true,
    filename: "photo-with-bears.jpg",
  });
});

it("find photo", async () => {
  const photoRepository = getConnection().getRepository(Photo);

  let photo = new Photo();
  photo.name = "ME and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;

  await photoRepository.save(photo);

  let savedPhotos = await photoRepository.find();
  expect(savedPhotos.length).toBe(1);

  let firstPhoto = await photoRepository.findOne(); // id: 1

  expect(firstPhoto).toBeDefined();

  let meAndBearsPhoto = await photoRepository.findOne({
    name: "ME and Bears",
  });
  expect(meAndBearsPhoto).toBeDefined();

  let allViewedPhotos = await photoRepository.find({ views: 1 });
  expect(allViewedPhotos.length).toBe(1);

  let allPublishedPhotos = await photoRepository.find({ isPublished: true });
  expect(allPublishedPhotos.length).toBe(1);

  let [allPhotos, photosCount] = await photoRepository.findAndCount();
  expect(photosCount).toBe(1);

  // Updating in the database
  let photoToUpdate = (await photoRepository.find())[0];
  if (photoToUpdate) {
    photoToUpdate.name = "Me, my friends and polar bears";
    await photoRepository.save(photoToUpdate);
  } else {
    fail("not reach");
  }

  let updatedPhoto = photoRepository.findOne({
    description: "Me, my firends and polar bears",
  });
  expect(updatedPhoto).toBeDefined();
});

it("Metadata is saved, and the relation between metadata and photo is created in the database too", async () => {
  const connection = getConnection();

  let photo = new Photo();
  photo.name = "Me an Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;

  // create a photo metadata
  let metadata = new PhotoMetadata();
  metadata.height = 650;
  metadata.width = 480;
  metadata.compressed = true;
  metadata.comment = "cybershoot";
  metadata.orientation = "portrait";
  metadata.photo = photo; // Connect relation

  let photoRepository = connection.getRepository(Photo);
  let metadataRepository = connection.getRepository(PhotoMetadata);

  await photoRepository.save(photo);

  await metadataRepository.save(metadata);

  // validate
  let savedPhoto = await photoRepository.findOne({ relations: ["metadata"] });
  if (savedPhoto) {
    expect(savedPhoto.metadata).toBeDefined();
  } else {
    fail("metadat must be existed");
  }

  // using queryBuilder
  savedPhoto = await photoRepository
    .createQueryBuilder("photo")
    .innerJoinAndSelect("photo.metadata", "metadata")
    .getOne();

  if (savedPhoto) {
    expect(savedPhoto.metadata).toBeDefined();
  } else {
    fail("metadat must be existed");
  }
});

it("Many-to-One relationship with Autor Entity", async () => {
  const connection = getConnection();

  let author = new Author();
  author.name = "user";

  let photo = new Photo();
  photo.name = "Me and Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.isPublished = true;
  photo.views = 1;
  photo.author = author;

  // create photo metadata object
  let metadata = new PhotoMetadata();
  metadata.height = 640;
  metadata.width = 480;
  metadata.compressed = true;
  metadata.comment = "cybershoot";
  metadata.orientation = "portrait";

  photo.metadata = metadata;

  let photoRepository = connection.getRepository(Photo);
  await photoRepository.save(photo);

  let savedPhoto = await photoRepository.findOne(
    {
      name: "Me and Bears",
    },
    { relations: ["metadata", "author"] }
  );
  expect(savedPhoto?.author.name).toBe("user");
});
