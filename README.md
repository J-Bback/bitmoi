## BITMOI
암호화폐 모의투자

#### 1. 완성된 GIF 파일 및 배포 링크
[BITMOI 와이어프레임](https://www.figma.com/proto/7usxJCuyjYt1Dv8Cd6mC5D/%EB%B9%84%ED%8A%B8%EC%BD%94%EC%9D%B8-%EB%AA%A8%EC%9D%98%ED%88%AC%EC%9E%90?node-id=10%3A145&scaling=min-zoom&page-id=10%3A144)

[BITMOI WEB](https://bitmoiapp.com/)

#### 2. 프로젝트 실행 방법
node v16.13.2
npm v8.1.2
```
yarn install
yarn run dev
```

#### 3. 사용한 스택 목록

- React, React-hooks, HTML5, CSS3, SCSS
- Next.js, JavaScript, TypeScript

#### 4. 구현한 기능 목록 (Software Requirement Specification)
***Atomic Design Pattern 적용***
- 
***세부적인 기능***
<!-- - 즐겨찾기 기능(홈, 거래소 페이지 간 공유)
- 다양한 차트 라이브러리를 이용하여 구현
- 암호화폐의 한글이름 및 심볼 검색기능
- 암호화폐 리스트 클릭 시, 해당 차트 뷰 및 거래기능
- 

#### 5. 구현 방법 및 구현하면서 어려웠던 점
#### 타입스크립트를 적용하며 발생하는 에러 핸들링: 시간적 자원이 많이 드는 요인
#### CORS error 해결
- 배포했을 때 모든 통신에서 CORS 에러 발생

-> CORS를 허용하는 프록시 서버를 사용

-> 429 (Too Many Requests) error 발생

-> 직접 프록시 서버를 배포 후 사용하여 해결
