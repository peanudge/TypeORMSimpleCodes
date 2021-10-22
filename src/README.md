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

```SQL
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

# Creating relationship

TypeORM을 이용해서 relationship을 생성하는 방법을 살펴보겠습니다.

관계에는 다양한 관계가 있습니다.

## Creating a one-to-one relation

우선 one-to-one부터 살펴보겠습니다.

`PhotoMetadata.ts`라는 클래스를 새로 정의해보겠습니다.

```ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class PhotoMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  height: number;

  @Column("int")
  width: number;

  @Column()
  orientation: string;

  @Column()
  compressed: boolean;

  @Column()
  comment: string;

  @OneToOne((type) => Photo)
  @JoinColumn()
  photo: Photo;
}
```

`@OneToOne`라고 불리는 새로운 데코레이터를 추가해서 사용했습니다. 두 가지 entities 사이의 one-to-one 관계를 가능하게 합니다.

`type => Photo` 는 우리가 관계를 만들기 원하는 엔티티의 `class`를 리턴합니다. 함수 대신 class를 직접적으로 넣어도 되지만 class를 리턴하는 함수를 사용할 것을 강요합니다. 언어 스팩 때문에?

해당 함수의 용도를 더 조사할 필요가 있습니다. 단순히 타입 시스템의 가독성을 높여주기 위해 사용되는지?

그리고 물론 `()=>Photo`로 사용할수 있지만, 우리는 코드 가독성을 증가시키기 위해서 convention으로 `type => Photo`로 사용하고 있습니다.

그리고 `@JoinColumn` 데코레이터를 추가 했습니다. 해당 데코레이터를 가지고 있는 Entity가 해당 관계를 소유한다고 말할 수 있습니다. 관계는 단방향 또는 양방향이 될 수 있습니다. 관계의 한쪽에서만 해당 관계를 소유할 수 있습니다.

위 Entity를 만들고 Connection 을 시도했다면(syncronized 옵션이 true일 경우) photo_metadata는 Photo 의 id를 가리키는 column을 추가로 가지고 있을 것입니다. 관계의 소유권을 가지고 있는 쪽이 반대쪽 Entity의 식별자를 가지게 됩니다.

# Save a one to one relation

```ts

createConnection(/* ... */).then(connection => {
  let photo = new Photo();
  ...

  let metadata = new PhotoMetadata();
  ...
  metadata.photo = photo; // this way we connect them.

  let photoRepository = connection.getRepository(Photo);
  let metadataRepository = connection.getRepository(PhotoMetadata);

  await photoRepository.save(photo);
  await metadataRepository.save(metadata);

}).catch(error => console.log(error));
```

위와 같이 관계를 엔티티에서 맺고 데이터를 넣을 때 `@JoinColumn` 프로퍼티에 단순히 값을 할당하면 가능합니다.

# Inverse side of relationship

관계는 단방향이거나 양방향입니다. 현재는 단방향 상태입니다. 관계의 소유자는 `PhotoMetadata` 이고 Photo는 PhotoMetadata에 대해서 어떤 것도 모릅니다. 우리가 inversion relation을 추가해야하는 이슈를 해결하기 위해서, PhotoMetadata and Photo 사이의 관계를 양방향으로 만들어야합니다.

```ts
@Entity()
export class PhotoMetadata {
  /*  ... other columns */
  @OneToOne((type) => Photo, (photo) => photo.metadata)
  @JoninColumn()
  photo: Photo;
}

@Entity()
export class Photo {
  /* ... other columns */
  @OneToOne((type) => PhotoMetadata, (photoMetadata) => photoMetadata.photo)
  metadata: PhotoMetadata;
}
```

`PhotoMetadata` 엔티티의 `@OneToOne`에 추가된 `(photo) => photo.metadata`는 관계의 inverse side의 이름을 돌려주는 함수 있습니다.

> 저쪽에서는 이렇게 접근해온다~ 라는 의미정도로 생각하면 될 듯 합니다.

그리고 `Photo` Entity에도 `@OneToOne` 데코레이터가 추가된 것을 알 수 있습니다.

주의할 점, 우리는 relation 의 한쪽에서만 오직 `@JoinColumn` 데코레이터를 사용해야합니다. decorator를 넣는 쪽이 관계를 소유하게 됩니다. 그리고 관계를 소유한 쪽에서 `foreign key` 컬럼을 가지게 됩니다.

# 관계들을 가지고 값을 가져오는 방법

지금부터 단일 쿼리로 photo와 metadata를 가져오겠습니다. 2가지 방법이 있습니다.

- `find*` 함수를 사용하거나
- `QueryBuilder` 기능을 사용하는 것

처음으로 `find*`를 사용해보겠습니다. `find*` 함수는 우리가 `FindOneOption`/`FindManyOptions` 인터페이스를 가진 객체를 명시할 수 있습니다.

```ts
let photoRepository = connection.getRepository(Photo);
let photos = await photoRepository.find({ relations: ["metadata"] });
```

photos들은 metadata들을 가지고 있을 것 입니다.

만약에 복잡한 쿼리가 필요하다면, 당신은 `QueryBuilder`를 대신 사용해야합니다. `QueryBuilder`는 더욱 복잡한 쿼리를 사용할 수 있습니다. (우아한 방식으로~)

```ts
createConnection(/* ... */).then(async (connection) => {
  let photos = await connection
    .getRepository(Photo)
    .createQueryBuilder("photo")
    .innerJoinAndSelect("photo.metadata", "metadata")
    .getMany();
});
```

QueryBuilder를 사용하면 SQL를 생성하는 것과 같이 생각할 수 있습니다.
예제에서는 "photo"와 "metadata"는 query에 의해 선택된 Photos들에 적용된 별칭들입니다.

# Using cascades to automatically save related objects

관계가 맺어진 object들을 자동으로 저장하기 위해서 cascade를 사용하는 법

우리는 우리의 관계들에 cascade 옵션을 설정할 수 있습니다. 우리가 다른 object를 저장할 때마다 관련된 object들도 저장되길 바랄떄.

`@OneToOne` Decorator를 변경해봅시다.

```ts
export class Photo {
  @OneToOne((type) => PhotoMetadata, (metadata) => metadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;
}
```

위와 같이 `{cascade: true}` 는 Photo와 metadata 따로 저장하는 것을 허락하지 않습니다.

그래서 아래와 같이 Photo Repository만으로 한번에 값을 저장할 수 있습니다.

```ts
// create photo object
let photo = new Photo();

// create photo metadata object
let metadata = new PhotoMetadata();

photo.metadata = metadata; // this way we connect them

// get repository
let photoRepository = connection.getRepository(Photo);

// saving a photo also save the metadata
await photoRepository.save(photo);
```

# Many-to-One / One-to-Many 관계

photo가 하나의 author를 가지고, 각 작가는 많은 photo를 가질 수 있습니다. `Author`클래스를 만듭시다.

```ts
@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany((type) => Photo, (photo) => photo.author) // note: we will create author property in the Photo class below
  photos: Photo[];
}

@Entity()
export class Photo {
  @ManyToOne((type) => Author, (author) => author.photos)
  author: Author;
}
```

`Author`는 관계에서 inverse side 입니다. `OneToMany`는 항상 관계에서의 inverse side입니다. 이것은 다른 쪽 relation에서의 `ManyToOne`없이는 존재할 수 없습니다.

many-to-one / one-to-many 관계에서 owner side는 항상 many-to-one 입니다. `@ManyToOne`을 사용하는 entity는 related object의 id를 저장하게 됨을 의미합니다.

위 엔티티를 구성하고 실행하게 되면 결과적으로 Many-to-one 관계가 생성됩니다.

# Many to Many 관계 만들기

many-to-many 관계 만들기. 앨범속에 많은 사진이 있다고 말할 수 있다.

```ts
@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Photo, (photo) => photo.albums)
  @JoinTable()
  photos: Photo[];
}
```
