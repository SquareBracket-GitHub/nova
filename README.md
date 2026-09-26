# Nova

Nova는 `diceBot`의 주사위·운세·이모지 기능과 `gachamond`의 커스텀 가챠 기능을 통합한 Discord 봇입니다.

## 기능

- `/ping`: 봇 응답 확인
- `/dice`: 일반 주사위 1~10회 굴리기
- `/special-dice`: 합계에 플러스 또는 마이너스 보정 적용
- `/fortune`: 한국 시간 기준 하루 한 번 운세 확인
- `/profile`: 사용자 활동 정보 표시
- `/gacha-create`: 커스텀 가챠 생성
- `/gacha-manage`: 가챠, 등급, 아이템 관리 및 1회/10회 가챠 공개
- `/gacha-delete`: 가챠와 하위 데이터를 함께 삭제
- 단독 커스텀 이모지 메시지 확대(정적 및 움직이는 이모지)

## 환경 분리

Nova는 동일한 코드와 이미지를 사용하되 TEST와 MAIN을 서로 다른 Compose 프로젝트로 운영합니다.

| 환경 | 환경 파일 | Compose 프로젝트 | Discord 명령 | DB 볼륨 |
| --- | --- | --- | --- | --- |
| TEST | `.env` | `nova-test` | 테스트 길드 전용 | `nova-test_db-data` |
| MAIN | `.env.production` | `nova-main` | 글로벌 | `nova-main_db-data` |

현재 운영 대상은 TEST입니다. `.env.production`은 MAIN 출시 준비가 시작될 때 별도로 생성하며 TEST 토큰, DB, 볼륨을 공유하지 않습니다.

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

MySQL에서 먼저 `schema.sql`을 실행합니다. 이 스키마는 Nova용 신규 스키마이며 기존 두 봇의 데이터가 자동으로 복사되지는 않습니다.

Discord Developer Portal에서 **Message Content Intent**를 활성화해야 이모지 확대 기능이 동작합니다. 또한 봇에는 메시지 보기, 메시지 보내기, 임베드 링크, 메시지 기록 보기, 메시지 관리 권한이 필요합니다.

## Docker Compose로 TEST 실행

미니컴에서는 다음 명령으로 TEST 스택을 실행합니다. DB 포트는 호스트에 공개되지 않으며 봇은 Compose 내부의 `db` 호스트로 접속합니다.

```sh
docker compose --env-file .env -p nova-test up -d --build
docker compose --env-file .env -p nova-test ps
docker compose --env-file .env -p nova-test logs -f bot
```

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
