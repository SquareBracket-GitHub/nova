# Nova

Nova는 `diceBot`의 주사위·운세·이모지 기능과 `gachamond`의 커스텀 가챠 기능을 통합한 Discord 봇입니다.

현재 릴리즈: **v1.0.0** (2026-10-01)

## 기능

- `/about`: Nova 소개, 명령어별 사용법 및 현재 상태 확인
- `/ping`: 봇 응답 확인
- `/dice`: 일반 주사위 1~10회 굴리기
- `/special-dice`: 합계에 플러스 또는 마이너스 보정 적용
- `/fortune`: 한국 시간 기준 하루 한 번 운세 확인
- `/me`: 활동 통계, 칭호, 가챠 컬렉션과 운세 기록 표시
- `/settings`: 서버 관리자 전용 언어 및 기능 설정
- `/gacha-create`: 커스텀 가챠 생성
- `/gacha-import`: CSV 또는 JSON 파일로 커스텀 가챠 일괄 생성
- `/gacha-export`: 내 가챠를 다시 가져올 수 있는 JSON 또는 CSV 파일로 내보내기
- `/gacha-manage`: 가챠, 등급, 아이템 관리 및 1회/10회 가챠 공개
- `/gacha-delete`: 가챠와 하위 데이터를 함께 삭제
- `/random`: 목록에서 하나 선택, 순서 섞기, 중복 없는 추첨, 무작위 팀 나누기
- `/signup`: 참가·참가 취소·모집 마감 버튼이 있는 공개 모집 패널 생성
- 단독 커스텀 이모지 메시지 확대(정적 및 움직이는 이모지)

## 환경 분리

Nova는 동일한 코드와 이미지를 사용하되 TEST와 MAIN을 서로 다른 Compose 프로젝트로 운영합니다.

| 환경 | 환경 파일 | Compose 프로젝트 | Discord 명령 | DB 볼륨 |
| --- | --- | --- | --- | --- |
| TEST | `.env` | `nova-test` | 테스트 길드 전용 | `nova-test_db-data` |
| MAIN | `.env.production` | `nova-main` | 글로벌 | `nova-main_db-data` |

MAIN 배포 전에는 `.env.production`을 별도로 생성하며 TEST 토큰, DB, 볼륨을 공유하지 않습니다.

## 로컬 설치

```sh
npm install
```

`.env.example`을 `.env`로 복사하고 TEST Discord 및 MySQL 접속 정보를 입력합니다.

```dotenv
BOT_ENV=test
NODE_ENV=development
TOKEN=your-test-discord-bot-token
CLIENT_ID=your-test-discord-application-id
COMMAND_MODE=GUILD
GUILD_ID=your-test-guild-id

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=nova_test
DB_PW=change-me
DB_NAME=nova_test
```

DB 스키마는 `migrations/`의 SQL 파일로 관리됩니다. Docker Compose에서는 `migrate` 서비스가 봇보다 먼저 미적용 마이그레이션을 자동 실행합니다. Node.js로 직접 구동할 때는 `npm run db:migrate`를 먼저 실행합니다. 기존 두 봇의 데이터는 자동으로 복사되지 않습니다.

Discord Developer Portal에서 **Message Content Intent**를 활성화해야 이모지 확대 기능이 동작합니다. 또한 봇에는 메시지 보기, 메시지 보내기, 임베드 링크, 메시지 기록 보기, 메시지 관리 권한이 필요합니다.

## Docker Compose로 TEST 실행

미니컴에서는 다음 명령으로 TEST 스택을 실행합니다. DB 포트는 호스트에 공개되지 않으며 봇은 Compose 내부의 `db` 호스트로 접속합니다.

```sh
docker compose --env-file .env -p nova-test up -d --build
docker compose --env-file .env -p nova-test ps
docker compose --env-file .env -p nova-test logs -f bot
```

`/settings`는 서버 안에서 **서버 관리(Manage Server)** 권한이 있는 사용자에게만 표시되며, 설정 화면과 조작 결과는 실행자에게만 보입니다. 서버별로 한국어/영어 응답 언어와 주사위·운세·가챠·이모지 확대 기능을 켜거나 끌 수 있습니다. `/ping`, `/me`, `/about`, `/settings`는 항상 사용할 수 있습니다.

Discord 명령은 봇 컨테이너와 동일한 TEST 환경으로 명시적으로 배포합니다.

```sh
docker compose --env-file .env -p nova-test run --rm bot node src/deployCommands.js
```

TEST 스택을 중지하되 DB 데이터는 보존하려면 다음 명령을 사용합니다.

```sh
docker compose --env-file .env -p nova-test down
```

`down -v`는 해당 환경의 DB를 완전히 삭제하므로 의도적인 초기화에만 사용합니다.

## Node.js로 직접 실행

```sh
npm run deployCommands
npm start
```

개발 중에는 `npm run dev`를 사용할 수 있습니다.

로컬 검증은 `npm test`로 실행합니다.

## 데이터 규칙

- 가챠는 사용자당 최대 25개입니다.
- 등급은 가챠당 최대 25개이며 확률은 1~100 사이의 정수입니다.
- 전체 등급 확률이 100% 미만이면 남은 확률은 꽝입니다.
- 아이템은 등급당 최대 25개이고 같은 등급 안에서 동일 확률로 선택됩니다.
- 가챠·등급·아이템 이름은 각각의 상위 범위 안에서 중복될 수 없습니다.
- 가챠 삭제 시 포함된 등급과 아이템도 외래키 cascade로 삭제됩니다.

## 언어 문구 관리

사용자에게 표시되는 한국어와 영어 문구는 언어별 파일에 모여 있습니다.

- `src/locales/ko.js`: 한국어 응답과 `/about` 안내
- `src/locales/en.js`: 영어 응답, `/about` 안내, Discord 명령 등록 설명

일반 응답은 `messages`, `/about` 페이지는 `about`, 슬래시 명령 등록 설명은 `src/locales/en.js`의 `commands` 객체에서 수정합니다. 명령어와 옵션의 등록 이름 및 설명은 Discord 언어와 서버 언어 설정에 관계없이 항상 영어로 표시됩니다. 두 언어의 `messages` 키는 항상 동일하게 유지해야 하며 `npm test`가 누락을 검사합니다.

## 가챠 파일 가져오기

`/gacha-import`에 256KB 이하의 `.json` 또는 `.csv` 파일을 첨부하면 새 가챠를 한 번에 만들 수 있습니다. 오류가 있으면 아무 데이터도 생성되지 않습니다.

JSON 형식:

```json
{
  "name": "보물 상자",
  "grades": [
    {
      "name": "희귀",
      "percentage": 20,
      "color": "purple",
      "items": [
        { "name": "왕관", "description": "빛나는 왕관" },
        "보석"
      ]
    }
  ]
}
```

CSV 형식에서는 다음 머리글을 사용합니다. 같은 등급의 `percentage`와 `color`는 모든 행에서 같아야 합니다.

```csv
gacha_name,grade_name,percentage,color,item_name,item_description
보물 상자,희귀,20,purple,왕관,빛나는 왕관
보물 상자,희귀,20,purple,보석,
보물 상자,일반,80,gray,동전,평범한 동전
```

사용 가능한 색상은 `gray`, `green`, `blue`, `purple`, `yellow`입니다.

`/gacha-export`는 소유한 가챠를 자동완성으로 선택하고 JSON(기본값) 또는 CSV 파일로 내려받습니다. 내보낸 파일은 `/gacha-import`에 그대로 사용할 수 있습니다.

## 무작위 도구

`/random`의 `items`에는 쉼표 또는 줄바꿈으로 구분한 항목을 2~40개 입력합니다. 각 항목은 최대 80자입니다.

- `pick`: 항목 하나 선택
- `order`: 전체 항목 순서 섞기
- `sample`: 지정한 개수만큼 중복 없이 추첨
- `team`: 지정한 팀 수로 최대한 균등하게 배분

## 참가 모집

`/signup title:<제목> [description:<설명>] [capacity:<2~50>]`으로 공개 모집 패널을 만듭니다. 누구나 버튼으로 참가하거나 취소할 수 있고, 모집을 만든 사용자만 마감할 수 있습니다. 모집 상태와 참가자 목록은 DB에 저장되어 봇이 재시작되어도 유지됩니다.
