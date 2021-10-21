# Installation

- TypeORM 설치

```bash
npm install typeorm --save
```

[TypeORM Step by Step Guide](https://typeorm.io/#/undefined/step-by-step-guide)를 따랐습니다.

# Create model

데이터베이스를 위한 작업은 테이블을 만들면서 시작합니다.

TypeORM을 통해 데이터베이스 테이블을 만들기 위해서는 Model들을 통해서 수행할 수 있습니다. 우리 Model이 곧 우리 데이터 베이스의 테이블들이 됩니다.

```js
export class Photo {
  id: number;
  name: string;
  description: string;
  filename: string;
  views: number;
  isPublished: boolean;
}
```

photo를 데이터베이스에 넣기 위해서 우리는 테이블이 필요했고 모델로 부터 테이블을 생성할 수 있습니다. 모든 모델이 그런 것은 아니고 `entites` 라고 정의된 것들이 이에 해당합니다.

# Create an entity

`Entity`는 `@Entity` 데코레이터에 의해 데코레이팅된 모델에 해당합니다. 데이터베이스 테이블은 데코레이터가 적용된 모델들을 이용해서 만들 수 있습니다.

```ts
import { Entity } from "typeorm";

@Entity()
export class Photo {
  id: number;
  name: string;
  description: string;
  filename: string;
  views: number;
  isPublished: boolean;
}
```

이렇게 Entity를 정의해두면 앱 어디서도 데이터베이스에 접근할 수 있습니다.
하지만 아직 Column이 없이 생성됩니다.

# Adding table columns

데이터 베이스 컬럼을 추가하기위해서 entity의 프로퍼티에 간단히 `@Column` 데코레이터를 추가해줘야합니다.

```import { Entity, Column } from "typeorm";

@Entity()
export class Photo {

    @Column()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    filename: string;

    @Column()
    views: number;

    @Column()
    isPublished: boolean;
}
```

photo 테이블에 위와 같은 컬럼들이 추가될 수 있습니다.
데이터베이스의 Column 타입들은 우리가 사용해놓은 타입들에 의해서 추론됩니다. `number`는 `integer`로, `string`은 `varchar`로, `boolean`는 `bool`등등, 하지만 우리는 column 타입을 `@Column` 데코레이터 속에 명시적으로 나타낼 수도 있습니다.

# Creating Primary Column

각 entity는 적어도 하나의 Primary Key column을 가져야합니다. 이것은 필수요구사항이니 피할 수는 없습니다. column을 pk로 만들기 위해서 `@PrimaryColumn` decorator를 사용할 필요가 있습니다.

```ts
import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Photo {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  filename: string;

  @Column()
  views: number;

  @Column()
  isPublished: boolean;
}
```

# Creating an auto-generated column

id column을 자동 생성되길 원한다고 가정해봅시다. `auto-increment`/`sequence`/`seriail`/`generated identity column` 으로 알려져있습니다. 이것을 수행하기 위해서는 `@PrimaryGeneratedColumn` decorator를 적용하면됩니다.

```ts
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;
    ...
}
```

# Column data Types

Data Type을 수정해보자. default로 `string`은 `varchar(255)`와 같은 타입에 매핑된다. `number`은 `integer`같은 타입에 매핑된다. 우리는 대게 모든 Column을 `varchars`나 `integer`로 제한 시키는것을 원하지않는다.

```javascript
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column("text")
  description: string;

  @Column()
  filename: string;

  @Column("double")
  views: number;

  @Column()
  isPublished: boolean;
}
```

Column Type들은 데이터베이스 스팩입니다. 사용하고자하는 데이터베이스가 지원하는 컬럼타입을 설정할 수 있습니다.
