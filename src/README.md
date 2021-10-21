# Creating Connection to the database

entity가 생성되었을 때, `index.ts` 파일을 만들고 connection을 설정해보자.

```ts
import "reflect-metadata";
import { createConnection } from "typeorm";
import { Photo } from "./entity/Photo";

createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "admin",
  database: "test",
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then((connection) => {
    // here you can start to work with your entities
  })
  .catch((error) => console.log(error));
```

우리는 Photo Entity를 entities 리스트속에 추가해야합니다.

`syncronize`는 우리의 entites들이 데이터베이스 동기화를 진행할 것입니다. 우리가 어플리케이션을 실행할 때마다.

# Running the application

어플리케이션을 실행할 하면 Photo Table이 생성되는 것을 확인할 수 있습니다.

Docker를 이용해서 Postgre DB를 설치해보겠습니다.

```bash
$ docker run -p 5432:5432 --name postgres -e POSTGRE_PASSWORD=1q2w3e4r -d po
stgres
$ docker exec -it postgres /bin/bash
```

그리고 Postgre 내에서 사용자와 데이터베이스를 생성하겠습니다.

```bash
$ psql -U postgres

CREATE USER jiho PASSWORD '1q2w3e4r' SUPERUSER;

CREATE DATABASE test OWNER jiho;

\c test jiho
```

jiho라는 계정을 생성후 test라는 데이터베이스 생성 후 데이터베이스에 접속합니다.

```ts
createConnection({
  type: "postgres",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "admin",
  database: "test",
  entities: [Photo],
  synchronize: true,
  logging: false,
})
  .then((connection) => {
    // here you can start to work with your entities
  })
  .catch((error) => console.log(error));
```

따로 테이블 스키마를 조회하는 명령은 pg에는 따로없는듯해서 쿼리로 조회해야합니다.

```
SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE TABLE_NAME='photo';
```

# Creating inserting a photo into the database

```ts
import { createConnection } from "typeorm";
import { Photo } from "./entity/Photo";

createConnection(/*...*/)
  .then((connection) => {
    let photo = new Photo();
    photo.name = "Me and Bears";
    photo.description = "I am near polar bears";
    photo.filename = "photo-with-bears.jpg";
    photo.views = 1;
    photo.isPublished = true;

    return connection.manager.save(photo).then((photo) => {
      console.log("Photo has been saved. Photo id is", photo.id);
    });
  })
  .catch((error) => console.log(error));
```

위 코드를 실행하면 entity가 저장됩니다. `save`함수는 같은 object의 instance를 돌려줍니다. 객체의 새로운 복사본은 아닙니다. 이것은 기존 객체에 "id"를 수정하고 돌려줍니다.

# Using async/await syntax

최신 ES8 기능들을 이용할 수 있습니다. 그래서 Promise 패턴을 사용하지않고 async await를 대신 사용하면 아래와 같이 됩니다.

# Using Entity Manager

우리가 새로운 photo를 생성하고 그것을 데이터베이스에 저장했습니다. 우리는 `EntityManager`를 사용했습니다.

Entity Manager를 사용하면 앱의 어떤 entity도 수정할 수 있습니다.

`connection.manager`

# Using Repositories

코드를 리팩토링하고 EntityManager대신 Repository를 사용해봅시다.
각 Entity는 각자의 repository(각자의 Entity Operation을 사용할 수 있는)를 가지고 있습니다. Entities가 많을 때, Repositories는 더욱 편리합니다.

```ts
import { createConnection } from "typeorm";
import { Photo } from "./entity/Photo";

createConnection(/*...*/).then(async (connection) => {
  let photo = new Photo();
  photo.name = "Me an Bears";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;

  let photoRepository = connection.getRepository(Photo);

  await photoRepository.save(photo);
  console.log("Photo has been saved");
});
```

위와 같이 repository를 생성하고 해당 repository를 이용해서

## Update in the database

```ts
let photoToUpdate = await photoRepository.findOne(1);
photoToUpdate.name = "Me, my friends and polar bears";
await photoRepository.save(photoToUpdate);
```

## Remove from the database

```ts
let photoToRemove = await photoRepository.findOne(1);
await photoRepository.remove(photoToRemove);
```
