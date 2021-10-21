# TypeORM Practice

- [공식 문서](https://typeorm.io/#/)

한글로 각 사용법 및 주의 사항 정리를 위한 저장소.

# Environment

- `typescript`: 타입스크립트를 컴파일하기 위해 설치
- `ts-node`: 메모리상에서 타입스크립트를 transpile 해서 바로 실행 할 수 있도록하기위해서 설치
- `jest`, `ts-jest` `@types/jest` : 테스트
- `pg` : postgre sql를 주로 테스트할 예정

- `reflect-metadata`: [자세한 설명](https://medium.com/jspoint/introduction-to-reflect-metadata-package-and-its-ecmascript-proposal-8798405d7d88). 클래서나 클래스 필드에 메타데이터를 추가할 수 있게 도와주는 라이브러리

### Typescript Configuration

- tsconfig.json

```
{

   /* Experimental Options */
    "experimentalDecorators": true /* Enables experimental support for ES7 decorators. */,
    "emitDecoratorMetadata": true /* Enables experimental support for emitting type metadata for decorators. */,
}
```
