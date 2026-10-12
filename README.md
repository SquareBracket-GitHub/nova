# Nova

편의성 봇 (주사위, 가챠, 기타 편의성 명령어)

**v1.2.1** (2026-10-12)

## 기능

- `/about`: Nova 소개, 명령어별 사용법 및 현재 상태 확인
- `/ping`: 봇 응답 확인
- `/dice`: 일반 주사위 1~10회 굴리기
- `/special-dice`: 합계에 플러스 또는 마이너스 보정 적용
- `/fortune`: 하루 한 번 운세 확인
- `/me`: 활동 통계, 등급, 가챠 컬렉션과 운세 기록 확인
- `/settings`: 서버 전용 언어 및 기능 설정
- `/gacha-create`: 가챠 생성
- `/gacha-import`: CSV 또는 JSON 파일로 가챠 생성
- `/gacha-export`: 내 가챠를 다시 가져올 수 있는 JSON 또는 CSV 파일로 내보내기
- `/gacha-manage`: 가챠, 등급, 아이템 관리 및 1회/10회 가챠 공개
- `/gacha-delete`: 가챠와 하위 데이터를 함께 삭제
- `/random`: 목록에서 하나 선택, 순서 섞기, 중복 없는 추첨, 무작위 팀 나누기
- `/signup`: 참가·참가 취소·모집 마감 버튼이 있는 공개 모집 패널 생성
- `/embed`: 임배드 생성
- 이모지 메시지 확대

## 환경 분리
| 환경 | 환경 파일 | Compose 프로젝트 | Discord 명령 | DB 볼륨 |
| --- | --- | --- | --- | --- |
| TEST | `.env` | `nova-test` | 테스트 길드 전용 | `nova-test_db-data` |
| MAIN | `.env.production` | `nova-main` | 글로벌 | `nova-main_db-data` |

MAIN 배포 전에는 `.env.production`을 생성하고 TEST 토큰, DB, 볼륨을 공유하지 않습니다.

## 로컬 설치

```sh
npm install
```

`.env.example`을 `.env`로 복사 생성 후 TEST Discord 및 MySQL 접속 정보를 입력하여 환경 변수를 설정해야합니다.

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

[Discord Developer Portal](https://discord.com/developers/home)에서 `Message Content Intent`를 활성화해야 이모지 확대 기능이 동작합니다. 또한 정상적인 구동을 위해 메시지 보기, 메시지 보내기, 임베드 링크, 메시지 기록 보기, 메시지 관리 권한을 필요로 합니다.

## Docker Compose로 TEST 실행

미니컴에서는 다음 명령으로 TEST 스택을 실행합니다. DB 포트는 호스트에 공개되지 않으며 봇은 Compose 내부의 `db` 호스트로 접속합니다:

```sh
docker compose --env-file .env -p nova-test up -d --build
docker compose --env-file .env -p nova-test ps
docker compose --env-file .env -p nova-test logs -f bot
```

`/settings`는 서버 안에서 **서버 관리 권한**이 있는 사용자에게만 표시되며, 설정 화면과 조작 결과는 실행자에게만 보입니다. 서버별로 한국어/영어 응답 언어와 주사위·운세·가챠·이모지 확대 기능을 켜거나 끌 수 있습니다. `/ping`, `/me`, `/about`, `/settings`는 항상 사용할 수 있습니다.

Discord 명령은 봇 컨테이너와 동일한 TEST 환경으로 명시적으로 배포합니다.

```sh
docker compose --env-file .env -p nova-test run --rm bot node src/deployCommands.js
```

TEST 스택을 중지하되 DB 데이터는 보존하려면 다음 명령을 사용합니다:

```sh
docker compose --env-file .env -p nova-test down
```
> ⚠️
> `down -v`는 해당 환경의 DB를 완전히 삭제하므로 의도적인 초기화에만 사용합니다.

## Node.js로 직접 실행

```sh
npm run deployCommands
npm start
```

개발 중에는 `npm run dev`를 사용할 수 있습니다.

로컬 검증은 `npm test`로 실행합니다.

## 언어 관리

사용자에게 표시되는 한국어와 영어 문구는 언어별 파일에 모여 있습니다.

- `src/locales/ko.js`
- `src/locales/en.js`

## 가챠 파일 가져오기

`/gacha-import`에 256KB 이하의 `.json` 또는 `.csv` 파일을 첨부하면 새 가챠를 한 번에 만들 수 있습니다. 오류가 있으면 테이터를 생성하지 않고 반환합니다.

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

CSV 형식에서는 다음 형식을 사용합니다. 같은 등급의 `percentage`와 `color`는 모든 행에서 동일해야 합니다:

```csv
gacha_name,grade_name,percentage,color,item_name,item_description
보물 상자,희귀,20,purple,왕관,빛나는 왕관
보물 상자,희귀,20,purple,보석,
보물 상자,일반,80,gray,동전,평범한 동전
```

색상은 `gray`, `green`, `blue`, `purple`, `yellow`, 그리고 HEX 코드를 지원합니다.

`/gacha-export`는 소유한 가챠를 자동완성으로 선택하고 JSON(기본값) 또는 CSV 파일로 내려받습니다. 내보낸 파일은 `/gacha-import`에 그대로 사용할 수 있습니다.

## 사용

NOVA와 NOVA test experience는 아래의 링크로 설치할 수 있습니다:

- [NOVA](https://discord.com/oauth2/authorize?client_id=1555079849062703204)
- [NOVA test experience](https://discord.com/oauth2/authorize?client_id=1553245998883807302)

> ⚠️
> `NOVA test experience`는 실험용 봇으로 빈번한 오류와 잦은 DB 리셋, 혹은 경우에 따라 사용이 제한 될 수 있습니다.

- - -
- DEV | [New Potato](https://github.com/SquareBracket-GitHub)
- Handler | [Square Handler](https://github.com/SquareBracket-GitHub/Square-Handler)
