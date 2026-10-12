const messages = {
  generic_error: '요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
  feature_disabled: '이 서버에서 해당 기능이 비활성화되어 있습니다.',
  settings_guild_only: '서버 안에서만 설정을 변경할 수 있습니다.',
  settings_permission: '해당 기능은 서버 관리 권한이 요구됩니다.',
  settings_title: 'NOVA 설정',
  settings_language: '언어',
  settings_features: '명령어',
  settings_enabled: '사용 중',
  settings_disabled: '사용 안 함',
  settings_language_placeholder: '언어를 선택하세요.',
  settings_reset: '설정 리셋',
  settings_reset_question: '모든 설정을 기본값으로 변경할까요?',
  settings_confirm: '변경',
  settings_cancel: '취소',
  settings_cancelled: '설정 초기화를 취소했습니다.',
  language_ko: '한국어',
  language_en: 'English',
  feature_dice: '주사위',
  feature_fortune: '운세',
  feature_gacha: '가챠',
  feature_emoji: '이모지 확대',
  dice_author: '{username}님의 {dice}',
  special_dice_author: '{username}님의 {effect} {dice}',
  effect_plus: '덧셈',
  effect_minus: '뺄셈',
  fortune_once: '운세는 하루에 한 번만 확인할 수 있습니다.',
  fortune_previous: '오늘 운세를 이미 확인했습니다. · {time} KST',
  fortune_author: '{username}님의 운세',
  fortune_1: '"BIG BROTHER IS WATCHING YOU."\n- 1984 中',
  fortune_2: '"세 명이 오리라."\n- 디아블로 IV 中',
  fortune_9: '"우리 기사의 불행한 사건에 대한 이야기가 계속되다."\n- 돈키호테 中',
  fortune_14: '당신은 충분히 잘하고 있습니다.',
  fortune_19: '돌다리를 두드리셔야겠군요!',
  fortune_29: '오늘은 안전한 선택이 좋겠습니다.',
  fortune_39: '서두를 필요는 없습니다. 인생은 긴 법이니까요.',
  fortune_44: '평범한 하루 속에 작은 행복이 있습니다.',
  fortune_49: '좋은 하루가 될 것 같군요. 오늘도 응원합니다.',
  fortune_59: '"인생은 하나의 초콜릿 상자 같아. 열기 전까지는 뭘 집을지 알 수 없어."\n- 포레스트 검프 中',
  fortune_66: '꾸준히 해온 일이 조금씩 빛을 발하는 날입니다.',
  fortune_67: '**Six Seven**',
  fortune_69: '망설이던 일이 있다면 도전해보는 것은 오늘일지도 모릅니다.',
  fortune_74: '"즐거운 일이 끝나는 것은 슬픈 일이나 괴로운 일도 끝나기 위해서 있는 것이란다."\n- 보노보노 中',
  fortune_79: '좋은 흐름이 왔습니다. 자신감을 가지세요!',
  fortune_84: '당신의 성공을 기원합니다.',
  fortune_89: '과감한 수로 한판승을 따보는게 어떤가요!',
  fortune_93: '진심을 다하기에 딱 맞는 하루입니다. 당신을 보여주세요.',
  fortune_98: '행운의 여신이 미소짓고 있군요! 오늘은 당신의 날입니다!',
  fortune_99: '"그는 빅브라더를 사랑했다."\n- 1984 中',
  fortune_100: '"나는 위를 바라보았고, 이미 별의 빛줄기에 휘감긴 산 꼭대기가 보였다.\n사람들이 자기 길을 올바로 걷도록 이끄는 별이었다."\n- 신곡 中',
  me_author: '{username} NOVA 이용 등급',
  me_rank_spark: '불빛',
  me_rank_explorer: '탐험가',
  me_rank_navigator: '항해자',
  me_rank_pioneer: '개척자',
  me_rank_next: '다음 칭호 **{rank}**까지 활동 점수 {count}',
  me_rank_max: 'NOVA 최고 이용 등급에 도달했습니다.',
  me_commands: '명령 사용',
  me_dice: '굴린 주사위',
  me_pulls: '가챠 뽑기',
  me_count: '{count}회',
  me_gacha_collection: '가챠 컬렉션',
  me_gacha_value: '가챠 {gachas}/25 · 등급 {grades}개 · 아이템 {items}개',
  me_fortune: '운세 기록',
  me_fortune_none: '아직 확인한 운세가 없습니다.',
  me_fortune_value: '총 {count}일 · 최근 {date}에 {score}점',
  me_first_seen: 'with NOVA',
  me_started_today: '오늘',
  me_activity_score: '활동 점수',
  me_tracking_notice: '사용량 통계는 v.1.0.0 릴리즈 이후부터 누적됩니다.',
  gacha_created: '가챠를 만들었습니다.',
  no_gachas_create: '아직 가챠가 없습니다. `/gacha-create`로 만들어 보세요.',
  choose_gacha_placeholder: '확인할 가챠를 선택하세요.',
  choose_gacha: '확인할 가챠를 선택하세요.',
  no_gachas_delete: '삭제할 가챠가 없습니다.',
  choose_gacha_delete_placeholder: '삭제할 가챠를 선택하세요.',
  choose_gacha_delete: '삭제할 가챠를 선택하세요. 이 작업은 되돌릴 수 없습니다.',
  gacha_deleted: '가챠와 등급 및 아이템을 삭제했습니다.',
  empty_gacha: '아직 등급과 아이템이 없습니다. 먼저 등급을 만들어 주세요.',
  blank_percentage: '{percentage}%는 꽝입니다.',
  create_grade: '등급 생성',
  manage_grades: '등급 관리',
  spawn_once: '1회 가챠 생성',
  spawn_ten: '10회 가챠 생성',
  spin: '뽑기!',
  spin_again_once: '다시 1회',
  spin_again_ten: '다시 10회',
  gacha_imported: '가챠 **{name}**을(를) 가져왔습니다. 등급 {grades}개 · 아이템 {items}개',
  gacha_import_too_large: '가져오기 파일은 256KB 이하여야 합니다.',
  gacha_import_download_failed: '첨부 파일을 불러오지 못했습니다. 다시 시도해주세요.',
  gacha_import_invalid: '가챠 파일을 읽을 수 없습니다: {reason}',
  gacha_import_duplicate: '파일 안의 가챠·등급·아이템 이름이 기존 데이터 또는 서로 중복됩니다.',
  gacha_exported: '가챠 **{name}**을(를) {format} 파일로 내보냈습니다.',
  random_pick_title: '랜덤 선택',
  random_order_title: '랜덤 순서',
  random_sample_title: '랜덤 추첨 · {count}개',
  random_team_title: '랜덤 팀 나누기',
  random_team_name: '{number}팀',
  random_need_items: '쉼표 또는 줄바꿈으로 구분한 항목을 2개 이상 입력해 주세요.',
  random_too_many_items: '항목은 최대 {maximum}개까지 입력할 수 있습니다.',
  random_item_too_long: '각 항목은 {maximum}자 이하여야 합니다.',
  random_sample_too_large: '추첨 개수는 전체 항목 수({count}개)를 넘을 수 없습니다.',
  random_team_too_large: '팀 수는 전체 항목 수({count}개)를 넘을 수 없습니다.',
  signup_status: '상태',
  signup_status_open: '모집 중',
  signup_status_closed: '모집 마감',
  signup_creator: '모집자',
  signup_participants: '참가자',
  signup_none: '아직 참가자가 없습니다.',
  signup_count: '{count}명 참가',
  signup_count_capacity: '{count}/{capacity}명 참가',
  signup_join: '참가',
  signup_leave: '참가 취소',
  signup_close: '모집 마감',
  signup_not_found: '이 모집은 더 이상 존재하지 않습니다.',
  signup_closed: '이미 마감된 모집입니다.',
  signup_full: '모집 정원이 가득 찼습니다.',
  signup_already_joined: '이미 이 모집에 참가했습니다.',
  signup_not_joined: '이 모집에 참가하지 않았습니다.',
  signup_close_owner: '모집을 만든 사용자만 마감할 수 있습니다.',
  no_grades: '아직 등급이 없습니다.',
  choose_grade_placeholder: '관리할 등급을 선택하세요.',
  choose_grade: '관리할 등급을 선택하세요.',
  no_items: '아직 아이템이 없습니다.',
  create_item: '아이템 생성',
  modify_grade: '등급 수정',
  modify_item: '아이템 수정',
  delete_grade: '등급 삭제',
  delete_item: '아이템 삭제',
  item_description: '아이템 설명',
  item_name: '아이템 이름',
  grade_name: '등급 이름',
  grade_percentage: '등급 확률 (1~100)',
  color: '색상',
  create_item_title: '아이템 생성',
  create_grade_title: '등급 생성',
  modify_item_title: '아이템 수정: {name}',
  modify_grade_title: '등급 수정: {name}',
  item_created: '아이템을 만들었습니다.',
  item_modified: '아이템을 수정했습니다.',
  item_deleted: '아이템을 삭제했습니다.',
  grade_created: '등급을 만들었습니다.',
  grade_modified: '등급을 수정했습니다.',
  grade_deleted: '등급과 포함된 아이템을 삭제했습니다.',
  no_items_modify: '수정할 아이템이 없습니다.',
  choose_item_modify_placeholder: '수정할 아이템을 선택하세요.',
  choose_item_modify: '수정할 아이템을 선택하세요.',
  no_items_delete: '삭제할 아이템이 없습니다.',
  choose_item_delete_placeholder: '삭제할 아이템을 선택하세요.',
  choose_item_delete: '삭제할 아이템을 선택하세요. 이 작업은 되돌릴 수 없습니다.',
  spawn_requires_grade: '가챠를 공개하기 전에 등급을 하나 이상 만들어 주세요.',
  gacha_author: '{username}님의 가챠',
  gacha_published: '<@{userId}>님이 가챠를 생성했습니다!',
  result_author: '{username}님의 결과',
  gacha_result_footer: '{name} · {creator}',
  blank: '꽝',
  blank_description: '아쉽지만 이번에는 꽝입니다. 다음 행운을 기대해 보세요.',
  gacha_missing: '이 가챠는 더 이상 존재하지 않습니다.',
  gacha_no_grades: '이 가챠에는 등급이 없습니다.',
  invalid_integer_percentage: '등급 확률에는 정수만 입력할 수 있습니다.',
  name_required: '{label} 이름을 입력해 주세요.',
  gacha_label: '가챠',
  grade_label: '등급',
  item_label: '아이템',
  gacha_not_owned: '해당 가챠를 찾을 수 없거나 관리 권한이 없습니다.',
  grade_not_owned: '해당 등급을 찾을 수 없거나 관리 권한이 없습니다.',
  item_not_owned: '해당 아이템을 찾을 수 없거나 관리 권한이 없습니다.',
  invalid_percentage: '등급 확률은 1부터 100 사이의 정수여야 합니다.',
  invalid_color: '색상은 gray, green, blue, purple, yellow 또는 6자리 HEX 코드여야 합니다.',
  invalid_embed_url: '링크와 이미지에는 올바른 HTTP 또는 HTTPS URL을 입력해야 합니다.',
  embed_url_requires_title: '제목 링크를 사용하려면 title도 입력해야 합니다.',
  embed_empty: 'title, description, author, footer, image, thumbnail 중 하나 이상을 입력해야 합니다.',
  embed_too_long: '임베드의 전체 텍스트는 6,000자를 넘을 수 없습니다.',
  gacha_limit: '가챠는 사용자당 최대 {maximum}개까지 만들 수 있습니다.',
  grade_limit: '등급은 가챠당 최대 {maximum}개까지 만들 수 있습니다.',
  item_limit: '아이템은 등급당 최대 {maximum}개까지 만들 수 있습니다.',
  percentage_limit: '전체 등급 확률의 합은 100%를 넘을 수 없습니다.',
  duplicate_gacha: '같은 이름의 가챠가 이미 있습니다.',
  duplicate_grade: '같은 이름의 등급이 이미 있습니다.',
  duplicate_item: '같은 이름의 아이템이 이미 있습니다.'
};

const about = {
  introTitle: 'NOVA',
  intro: 'Discord 편의성 봇.\n' +
    '\n' +
    '이 임배드에서 각 명령어의 사용법과 제한을 확인할 수 있습니다. 아래 버튼으로 페이지를 이동하세요.\n' +
    '\n' +
    '**둘러보기**\n' +
    '• 일반 및 특수 주사위\n' +
    '• 오늘의 운세\n' +
    '• 가챠\n' +
    '• 이모지 자동 확대\n' +
    '• 언어 및 기능 설정',
  statusTitle: 'NOVA 상태',
  releaseDate: '릴리즈 날짜',
  uptime: '구동 시간',
  ping: 'Gateway Ping',
  unavailable: '확인 불가',
  first: '처음',
  previous: '이전',
  next: '다음',
  last: '마지막',
  notOwner: '이 안내 페이지는 명령어를 실행한 사용자만 조작할 수 있습니다.',
  uptimeFormat: '{days}일 {hours}시간 {minutes}분 {seconds}초',
  pages: {
    about: {
      summary: 'NOVA의 기능 안내. 명령어별 설명과 현재 봇 상태를 확인할 수 있습니다.',
      usage: '`/about`',
      notes: '안내 메시지는 채널에 공개되지만 페이지 버튼은 실행자만 조작할 수 있습니다.'
    },
    ping: {
      summary: 'NOVA 응답 확인용 명령어입니다.',
      usage: '`/ping`',
      notes: '`Pong!`으로 응답합니다. 자세한 Gateway 지연 시간은 이 안내서의 마지막 페이지에서 확인할 수 있습니다.'
    },
    dice: {
      summary: '지정한 면수의 주사위를 1~10회 굴리고 합계를 표시합니다.',
      usage: '`/dice d:<면수> [times:<횟수>] [ephemeral:<비공개 여부>]`',
      notes: '`d`는 2~1,000,000, `times`는 1~10이며 기본 1회입니다. `ephemeral`을 활성화하면 결과가 자신에게만 표시됩니다.'
    },
    'special-dice': {
      summary: '주사위 합계에 고정 보정값을 더하거나 뺍니다.',
      usage: '`/special-dice d:<면수> effect:<plus|minus> effect-num:<보정값> [times:<횟수>] [ephemeral:<비공개 여부>]`',
      notes: '`d`와 `effect-num`은 1,000,000 이하, `times`는 1~10입니다. 보정은 전체 합계에 한 번 적용됩니다.'
    },
    fortune: {
      summary: '오늘의 운세를 1~100의 행운 점수로 확인합니다.',
      usage: '`/fortune`',
      notes: '하루의 첫 결과가 저장됩니다. 같은 날 다시 실행하면 새로 추첨하지 않고 기존 점수와 최초 확인 시각(KST)을 비공개로 보여줍니다.'
    },
    me: {
      summary: '자신의 NOVA 활동 기록, 가챠 컬렉션과 활동 등급을 확인합니다.',
      usage: '`/me`',
      notes: '명령 사용 횟수, 굴린 주사위 수, 가챠 뽑기 횟수, 보유한 가챠·등급·아이템, 운세 기록, 사용 시작일과 활동 점수를 보여줍니다.'
    },
    'gacha-create': {
      summary: '가챠를 새로 만듭니다.',
      usage: '`/gacha-create gacha_name:<이름>`',
      notes: '이름은 1~40자이며 사용자당 가챠를 최대 25개까지 만들 수 있습니다. 생성 후 `/gacha-manage`에서 등급과 아이템을 추가하세요.'
    },
    'gacha-manage': {
      summary: '내 가챠의 등급·확률·색상·아이템을 확인하고 편집하거나 채널에 공개합니다.',
      usage: '`/gacha-manage`',
      notes: '가챠당 등급 25개, 등급당 아이템 25개까지 지원합니다. 색상은 `gray`, `green`, `blue`, `purple`, `yellow` 또는 `#123456` 같은 6자리 HEX 코드를 사용할 수 있습니다. 등급 확률 합계가 100%보다 작으면 남은 확률은 꽝입니다. 가챠를 돌린 후 `다시 1회`, `다시 10회`를 사용할 수 있습니다.'
    },
    'gacha-delete': {
      summary: '내 가챠 하나를 선택해 삭제합니다.',
      usage: '`/gacha-delete`',
      notes: '가챠를 삭제하면 포함된 모든 등급과 아이템도 함께 삭제되며 되돌릴 수 없습니다.'
    },
    'gacha-import': {
      summary: 'CSV 또는 JSON 파일 하나로 새 가챠와 등급·아이템을 일괄 생성합니다.',
      usage: '`/gacha-import file:<.json 또는 .csv 파일>`',
      notes: '**JSON 형식**\n' +
        '```json\n' +
        '{"name":"보물 상자","grades":[{"name":"희귀","percentage":20,"color":"purple","items":[{"name":"왕관","description":"빛나는 왕관"},"보석"]}]}\n' +
        '```\n' +
        '**CSV 형식**\n' +
        '```csv\n' +
        'gacha_name,grade_name,percentage,color,item_name,item_description\n' +
        '보물 상자,희귀,20,purple,왕관,빛나는 왕관\n' +
        '보물 상자,일반,80,gray,동전,평범한 동전\n' +
        '```\n' +
        '파일은 256KB 이하여야 하며 색상은 `gray`, `green`, `blue`, `purple`, `yellow` 또는 `#123456` 같은 6자리 HEX 코드입니다. `#`은 생략할 수 있습니다. CSV의 모든 행은 같은 `gacha_name`을 사용하고, 같은 등급의 `percentage`와 `color`도 일치해야 합니다. 전체 확률은 100%를 넘을 수 없으며 오류가 있으면 아무 데이터도 생성되지 않습니다.'
    },
    'gacha-export': {
      summary: '내 가챠를 `/gacha-import`와 호환되는 JSON 또는 CSV 파일로 내려받습니다.',
      usage: '`/gacha-export gacha:<내 가챠> [format:<JSON|CSV>]`',
      notes: '가챠 이름을 입력하면 자동완성 목록이 나타납니다. 기본 형식은 JSON입니다. 모든 등급·확률·색상·아이템·설명을 보존하며 내려받은 파일은 `/gacha-import`로 다시 가져올 수 있습니다.'
    },
    random: {
      summary: '목록에서 하나를 고르거나, 순서를 섞거나, 여러 개를 추첨하거나, 무작위 팀으로 나눕니다.',
      usage: '`/random pick|order|sample|team items:<쉼표 또는 줄바꿈으로 구분한 목록> ...`',
      notes: '항목은 2~40개를 입력할 수 있습니다. `sample`은 추첨으로 목록 중 일부를 뽑고, `team`은 항목을 섞어 배분합니다. `ephemeral`을 활성화하면 결과가 자신에게만 표시됩니다.'
    },
    embed: {
      summary: '원하는 속성을 조합해 현재 채널에 사용자 지정 임베드를 게시합니다.',
      usage: '`/embed [title] [description] [color] [url] [image] [thumbnail] [author] [footer] [timestamp]`',
      notes: '`title`, `description`, `author`, `footer`, `image`, `thumbnail` 중 하나 이상이 필요합니다. 색상은 `gray`, `green`, `blue`, `purple`, `yellow` 또는 `#123456` 같은 6자리 HEX 코드를 지원하며 `#`은 생략할 수 있습니다.'
    },
    signup: {
      summary: '참가·참가 취소·모집 마감 버튼이 있는 공개 모집 패널을 만듭니다.',
      usage: '`/signup title:<제목> [description:<설명>] [capacity:<2~50>]`',
      notes: '모집이 열려 있는 동안 누구나 참가하거나 취소할 수 있고, 모집을 만든 사용자만 마감할 수 있습니다.'
    },
    settings: {
      summary: '현재 서버의 NOVA 응답 언어와 기능 사용 여부를 설정합니다.',
      usage: '`/settings`',
      notes: '서버 안에서 `서버 관리` 권한이 있는 사용자만 실행할 수 있습니다. 주사위·운세·가챠·이모지 확대 기능을 각각 켜거나 끌 수 있으며 설정 화면은 실행자에게만 보입니다.'
    }
  },
  summaryLabel: '설명',
  usageLabel: '사용법',
  notesLabel: '세부 사항'
};

module.exports = { about, messages };
