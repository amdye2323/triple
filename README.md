# [Triple Test Project]

> 트리플 사용자들이 장소에 리뷰를 작성할 때 포인트를 부여하고, 전체/개인에 대한 포인트 부여 히스토리와 개인별 누적 포인트를 관리하고자 합니다.

### SPECIFICATIONS

리뷰 작성이 이뤄질때마다 리뷰 작성 이벤트가 발생하고, 정의된 API로 이벤트를 전달합니다.

### RequireMents

- [x] 서비스를 위한 테이블 설계 및 인덱스 에 대한 ERD 및 DDL 정의
- [x] POST/events 로 리뷰 작성 및 포인트 적립
- [x] GET /points:userId 로 유저의 포인트 조회
- [x] 상세 요구 사항 정의
- [x] 테스트 케이스 작성 완료

### SERVER

- JavaScript / TypeScript
- NestJS
- TypeORM
- Mysql 5.7
- Jest / Mock

### ERD

- https://drive.google.com/file/d/1fjhf-y8CcYWvI24UDUUzu3Di9fNwU1fZ/view?usp=sharing

### DDL

```
CREATE TABLE `review` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '키 값',
  `reviewUUID` varchar(64) NOT NULL COMMENT '리뷰 아이디',
  `type` varchar(24) NOT NULL COMMENT '리뷰 유형',
  `userUUID` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '유저 아이디',
  `placeUUID` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '장소 아이디',
  `content` varchar(256) COLLATE utf8_bin NOT NULL COMMENT '리뷰 내용',
  `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deletedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `reviewTypeIndex` (type)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `point` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '키 값',
  `userUUID` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '유저 아이디',
  `reviewId` int(11) NOT NULL COMMENT '리뷰 아이디',
  `point` int(11) NOT NULL DEFAULT 0 COMMENT '포인트',
  `pointType` tinyInt(2) NOT NULL COMMENT "포인트 타입 -> 0: 텍스트 , 1: 사진 , 2: 장소 보너스",
  `createdDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedDate` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `deletedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX(`userUUID`),
  CONSTRAINT `review_point_foregin_key` FOREIGN KEY (`reviewId`) REFERENCES `review` (`id`)    
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '키 값',
  `reviewId` int(11) NOT NULL COMMENT '리뷰 아이디',
  `photoUUID` varchar(64) COLLATE utf8_bin NOT NULL COMMENT '사진 아이디',
  PRIMARY KEY (`id`),
  CONSTRAINT `review_photo_foregin_key` FOREIGN KEY (`reviewId`) REFERENCES `review` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
```

### Environments

- .env 파일에서 Local 환경 변수를 세팅해주세요.
- node -v v17.4.0
- yarn -v 1.22.17

### Build

```
npm install
```

```
npm run build
```
### Run Test

```
npm run test
```

### Run

```
npm run start
```

### Api Call Example

- POST /events

```
Request Body:json

{
    "type": "REVIEW",
    "action": "ADD",
    "reviewId": "240a0658-dc5f-4878-9381-ebb7b26677711",
    "content": "좋아요!",
    "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
    "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
    "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00d"
}

Response Body
{
    "message": "해당 리뷰 요청이 성공적으로 완료되었습니다.",
    "data": {
        "id": 10,
        "type": "REVIEW",
        "reviewUUID": "240a0658-dc5f-4878-9381-ebb7b26677711",
        "userUUID": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
        "placeUUID": "2e4baf1c-5acb-4efb-a1af-eddada31b00d",
        "content": "좋아요!",
        "createdDate": "2022-06-21T00:19:26.036Z",
        "updatedDate": "2022-06-21T00:19:26.036Z",
        "deletedDate": null,
        "photos": [
            {
                "id": 15,
                "reviewId": 10,
                "photoUUID": "e4d1a64e-a531-46de-88d0-ff0ed70c0bb8"
            },
            {
                "id": 16,
                "reviewId": 10,
                "photoUUID": "afb0cef2-851d-4a50-bb07-9cc15cbdc332"
            }
        ],
        "pointList": [
            {
                "id": 15,
                "userUUID": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
                "reviewId": 10,
                "pointType": 0,
                "point": 1,
                "createdDate": "2022-06-21T00:19:26.078Z",
                "updatedDate": "2022-06-21T00:19:26.078Z",
                "deletedDate": null
            },
            {
                "id": 16,
                "userUUID": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
                "reviewId": 10,
                "pointType": 1,
                "point": 1,
                "createdDate": "2022-06-21T00:19:26.089Z",
                "updatedDate": "2022-06-21T00:19:26.089Z",
                "deletedDate": null
            },
            {
                "id": 17,
                "userUUID": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
                "reviewId": 10,
                "pointType": 2,
                "point": 1,
                "createdDate": "2022-06-21T00:19:26.097Z",
                "updatedDate": "2022-06-21T00:19:26.097Z",
                "deletedDate": null
            }
        ]
    }
}
```

- GET /points

```
Request Query Params
- userId : 3ede0ef2-92b7-4817-a5f3-0c575361f745

Response Body
{
    "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
    "totalPoint": "3",
    "pointList": [
        {
            "reviewId": "240a0658-dc5f-4878-9381-ebb7b26677711",
            "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00d",
            "reviewType": "REVIEW",
            "pointType": "내용 보너스",
            "point": 1,
            "createdDate": "2022-06-21 09:19:26"
        },
        {
            "reviewId": "240a0658-dc5f-4878-9381-ebb7b26677711",
            "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00d",
            "reviewType": "REVIEW",
            "pointType": "사진 보너스",
            "point": 1,
            "createdDate": "2022-06-21 09:19:26"
        },
        {
            "reviewId": "240a0658-dc5f-4878-9381-ebb7b26677711",
            "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00d",
            "reviewType": "REVIEW",
            "pointType": "첫 장소 보너스",
            "point": 1,
            "createdDate": "2022-06-21 09:19:26"
        }
    ]
}
```

- npm run test

```
 PASS  src/app.controller.spec.ts
  AppController
    root
      ✓ should return "Hello World!" (7 ms)

 PASS  src/point/service/point.service.spec.ts
  PointService
    Type: ADD
      ✓ 포인트 적립 시 해당 적립 기점이 존재 할때 점수 추가 (8 ms)
    Type: MOD
      ✓ 리뷰 수정 시 장소 변경이 일어나지 않는다면 첫 장소 보너스 포인트 그대로 존재 3점에서 사진 삭제로 2점 (2 ms)
    Type: DELETE
      ✓ 리뷰 삭제시 해당 리뷰에 해당되는 포인트 정보 삭제 (2 ms)

 PASS  src/review/service/review.service.spec.ts
  ReviewService
    Type: ADD
      ✓ 리뷰 작성 시 이미 작성이 된 리뷰 아이디로 등록시 에러 리턴 (14 ms)
      ✓ 리뷰 작성 시 해당 장소에 해당 유저가 한번이라도 리뷰를 작성했다면 에러 리턴 (2 ms)
      ✓ 리뷰 작성 시 리뷰를 생성하고 반환한다. (2 ms)
    Type: MOD
      ✓ 생성되지 않은 리뷰 아이디(UUID)가 주어진다면 리뷰를 찾을 수 없다는 예외를 던진다. (2 ms)
      ✓ 존재하는 리뷰 아이디(UUID)가 주어진다면 해당 리뷰를 수정하고 수정된 리뷰를 반환한다. (3 ms)
    Type: DELETE
      ✓ 생성되지 리뷰 아이디(UUID)가 주어진다면 리뷰를 찾을 수 없다는 예외를 던진다. (2 ms)
      ✓ 존재하는 리뷰 아이디(UUID)가 주어진다면 해당 리뷰를 삭제(deleteDate 주입)하고 해당 리뷰를 반환한다. (2 ms)
```