# 소개

> TypeORM is an ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8). Its goal is to always support the latest JavaScript features and provide additional features that help you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.

타입 ORM은 NodeJS, 브라우저, Cordova, ReactNatice 등등 개발환경에서 동작하는 ORM 프레임워크입니다. Typescript와 사용될 수 있으며 최신 모던 자바스크립트를 사용해서 개발할 수 있습니다. 최신 자바스크립트 특성들을 지원하고 데이터 베이스를 사용하는 어플리케이션을 개발하는데 도움되는 추가적인 기능들을 제공하는 것을 목적으로 합나다.

적은 모델 테이블을 가진 작은 어플리케이션에서 부터 다중 데이터베이스를 사용하는 규모가 큰 기업용 어플리케이션까지 지원합니다.

> TypeORM supports both Active Record and Data Mapper patterns, unlike all other JavaScript ORMs currently in existence, which means you can write high quality, loosely coupled, scalable, maintainable applications the most productive way.

TypeORM은 현재 다른 자바스크립트 ORM과 달리 [Active Record](https://typeorm.io/#/active-record-data-mapper/what-is-the-active-record-pattern)와 [Data Mapper](https://typeorm.io/#/active-record-data-mapper/what-is-the-data-mapper-pattern) 패턴 둘다 지원합니다. 이것은 우리가 매우 좋은 퀄리티를 가지고, 느슨하게 결합되며 확장성과 유지보수정을 가진 어플리케이션을 개발할 수 있음을 의미합니다.

Active Record는 모델 class에 모델을 CRUD하는 메소드를 함꼐두는 것을 의미하고 Data Mappter은 Repository를 따로두고 데이터와 데이터 접근 메소드를 따로 두는 방식을 의미합니다.

> TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework.

TypeORM은 Java의 Hibernate, C# Entity Framework 와 같은 다른 ORM들의 영향을 많이 받았습니다.
