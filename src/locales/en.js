const messages = {
  generic_error: 'Something went wrong while processing the request. Please try again later.',
  feature_disabled: 'This feature is disabled in this server.',
  settings_guild_only: 'Settings can only be changed inside a server.',
  settings_permission: 'This feature requires the Manage Server permission.',
  settings_title: 'NOVA Settings',
  settings_language: 'Language',
  settings_features: 'Commands',
  settings_enabled: 'Enabled',
  settings_disabled: 'Disabled',
  settings_language_placeholder: 'Choose the response language.',
  settings_reset: 'Reset settings',
  settings_reset_question: 'Change every setting back to its default?',
  settings_confirm: 'Change',
  settings_cancel: 'Cancel',
  settings_cancelled: 'Settings reset cancelled.',
  language_ko: '한국어',
  language_en: 'English',
  feature_dice: 'Dice',
  feature_fortune: 'Fortune',
  feature_gacha: 'Gacha',
  feature_emoji: 'Emoji expansion',
  dice_author: "{username}'s {dice}",
  special_dice_author: "{username}'s {effect} {dice}",
  effect_plus: 'addition',
  effect_minus: 'subtraction',
  fortune_once: 'You can check your fortune only once per day.',
  fortune_previous: 'You already checked today’s fortune. · {time} KST',
  fortune_author: "{username}'s fortune",
  fortune_1: 'You are doing well enough already.',
  fortune_2: 'It may be good to push yourself a little more today.',
  fortune_3: 'It looks like it will be a good day. I am rooting for you today, too.',
  fortune_4: 'Wishing you success.',
  fortune_5: 'Today is perfect for giving it your all. Show them who you are.',
  me_author: "{username}'s NOVA user level",
  me_rank_spark: 'Glow',
  me_rank_explorer: 'Explorer',
  me_rank_navigator: 'Navigator',
  me_rank_pioneer: 'Pioneer',
  me_rank_next: '{count} activity points until **{rank}**',
  me_rank_max: 'You have reached NOVA’s highest user level.',
  me_commands: 'Command uses',
  me_dice: 'Dice rolled',
  me_pulls: 'Gacha pulls',
  me_count: '{count} times',
  me_gacha_collection: 'Gacha collection',
  me_gacha_value: 'Gachas {gachas}/25 · {grades} grades · {items} items',
  me_fortune: 'Fortune history',
  me_fortune_none: 'You have not checked a fortune yet.',
  me_fortune_value: '{count} days · Latest: {score} on {date}',
  me_first_seen: 'with NOVA',
  me_started_today: 'Today',
  me_activity_score: 'Activity score',
  me_tracking_notice: 'Usage statistics have accumulated since the v.1.0.0 release.',
  gacha_created: 'Gacha created.',
  no_gachas_create: 'You do not have any gachas yet. Create one with `/gacha-create`.',
  choose_gacha_placeholder: 'Choose a gacha to inspect.',
  choose_gacha: 'Choose a gacha to inspect.',
  no_gachas_delete: 'There are no gachas to delete.',
  choose_gacha_delete_placeholder: 'Choose a gacha to delete.',
  choose_gacha_delete: 'Choose a gacha to delete. This cannot be undone.',
  gacha_deleted: 'The gacha, its grades, and its items were deleted.',
  empty_gacha: 'This gacha has no grades or items yet. Create a grade first.',
  blank_percentage: '{percentage}% is no prize.',
  create_grade: 'Create grade',
  manage_grades: 'Manage grades',
  spawn_once: 'Create 1-pull gacha',
  spawn_ten: 'Create 10-pull gacha',
  spin: 'Spin!',
  spin_again_once: 'Pull 1 again',
  spin_again_ten: 'Pull 10 again',
  gacha_imported: 'Imported gacha **{name}** with {grades} grades and {items} items.',
  gacha_import_too_large: 'Import files must be 256 KB or smaller.',
  gacha_import_download_failed: 'The attachment could not be loaded. Please try again.',
  gacha_import_invalid: 'The gacha file could not be read: {reason}',
  gacha_import_duplicate: 'A gacha, grade, or item name in the file conflicts with existing or imported data.',
  gacha_exported: 'Exported **{name}** as {format}.',
  random_pick_title: 'Random selection',
  random_order_title: 'Random order',
  random_sample_title: 'Random draw · {count}',
  random_team_title: 'Random team assignment',
  random_team_name: 'Team {number}',
  random_need_items: 'Enter at least two items separated by commas or new lines.',
  random_too_many_items: 'You can enter up to {maximum} items.',
  random_item_too_long: 'Each item must be {maximum} characters or fewer.',
  random_sample_too_large: 'The sample count cannot exceed the number of items ({count}).',
  random_team_too_large: 'The team count cannot exceed the number of items ({count}).',
  signup_status: 'Status',
  signup_status_open: 'Open',
  signup_status_closed: 'Closed',
  signup_creator: 'Organizer',
  signup_participants: 'Participants',
  signup_none: 'No one has joined yet.',
  signup_count: '{count} joined',
  signup_count_capacity: '{count}/{capacity} joined',
  signup_join: 'Join',
  signup_leave: 'Leave',
  signup_close: 'Close',
  signup_not_found: 'This signup no longer exists.',
  signup_closed: 'This signup is already closed.',
  signup_full: 'This signup is full.',
  signup_already_joined: 'You have already joined this signup.',
  signup_not_joined: 'You have not joined this signup.',
  signup_close_owner: 'Only the organizer can close this signup.',
  no_grades: 'There are no grades yet.',
  choose_grade_placeholder: 'Choose a grade to manage.',
  choose_grade: 'Choose a grade to manage.',
  no_items: 'There are no items yet.',
  create_item: 'Create item',
  modify_grade: 'Edit grade',
  modify_item: 'Edit item',
  delete_grade: 'Delete grade',
  delete_item: 'Delete item',
  item_description: 'Item description',
  item_name: 'Item name',
  grade_name: 'Grade name',
  grade_percentage: 'Grade probability (1–100)',
  color: 'Color',
  create_item_title: 'Create item',
  create_grade_title: 'Create grade',
  modify_item_title: 'Edit item: {name}',
  modify_grade_title: 'Edit grade: {name}',
  item_created: 'Item created.',
  item_modified: 'Item edited.',
  item_deleted: 'Item deleted.',
  grade_created: 'Grade created.',
  grade_modified: 'Grade edited.',
  grade_deleted: 'The grade and all of its items were deleted.',
  no_items_modify: 'There are no items to edit.',
  choose_item_modify_placeholder: 'Choose an item to edit.',
  choose_item_modify: 'Choose an item to edit.',
  no_items_delete: 'There are no items to delete.',
  choose_item_delete_placeholder: 'Choose an item to delete.',
  choose_item_delete: 'Choose an item to delete. This cannot be undone.',
  spawn_requires_grade: 'Create at least one grade before publishing this gacha.',
  gacha_author: "{username}'s gacha",
  gacha_published: '<@{userId}> published a gacha!',
  result_author: "{username}'s result",
  gacha_result_footer: '{name} · {creator}',
  blank: 'No prize',
  blank_description: 'Unfortunately, this pull is a miss. Better luck next time.',
  gacha_missing: 'This gacha no longer exists.',
  gacha_no_grades: 'This gacha has no grades.',
  invalid_integer_percentage: 'Grade probability must be an integer.',
  name_required: 'Enter a name for the {label}.',
  gacha_label: 'gacha',
  grade_label: 'grade',
  item_label: 'item',
  gacha_not_owned: 'The gacha could not be found or you do not have permission to manage it.',
  grade_not_owned: 'The grade could not be found or you do not have permission to manage it.',
  item_not_owned: 'The item could not be found or you do not have permission to manage it.',
  invalid_percentage: 'Grade probability must be an integer from 1 to 100.',
  invalid_color: 'Color must be gray, green, blue, purple, yellow, or a six-digit hex code.',
  invalid_embed_url: 'Links and images must use a valid HTTP or HTTPS URL.',
  embed_url_requires_title: 'The title option is required when using a title URL.',
  embed_empty: 'Provide at least one of title, description, author, footer, image, or thumbnail.',
  embed_too_long: 'The embed cannot contain more than 6,000 text characters.',
  gacha_limit: 'You can create up to {maximum} gachas.',
  grade_limit: 'A gacha can contain up to {maximum} grades.',
  item_limit: 'A grade can contain up to {maximum} items.',
  percentage_limit: 'The combined grade probability cannot exceed 100%.',
  duplicate_gacha: 'A gacha with that name already exists.',
  duplicate_grade: 'A grade with that name already exists.',
  duplicate_item: 'An item with that name already exists.'
};

const about = {
  introTitle: 'NOVA',
  intro: 'A Discord utility bot.\n' +
    '\n' +
    'This embed explains how to use each command and its limits. Use the buttons below to change pages.\n' +
    '\n' +
    '**Explore**\n' +
    '• Standard and special dice\n' +
    '• Today’s fortune\n' +
    '• Gacha\n' +
    '• Automatic emoji enlargement\n' +
    '• Language and feature settings',
  statusTitle: 'NOVA Status',
  releaseDate: 'Release date',
  uptime: 'Uptime',
  ping: 'Gateway Ping',
  unavailable: 'Unavailable',
  first: 'First',
  previous: 'Previous',
  next: 'Next',
  last: 'Last',
  notOwner: 'Only the user who opened this guide can change its pages.',
  uptimeFormat: '{days}d {hours}h {minutes}m {seconds}s',
  pages: {
    about: {
      summary: 'A guide to NOVA’s features. View descriptions for each command and the current bot status.',
      usage: '`/about`',
      notes: 'The guide is visible in the channel, but only its creator can operate the navigation buttons.'
    },
    ping: {
      summary: 'Check whether NOVA is responding.',
      usage: '`/ping`',
      notes: 'Replies with `Pong!`. The final page of this guide shows the current Gateway latency.'
    },
    dice: {
      summary: 'Roll a die with the requested number of sides 1–10 times and show the total.',
      usage: '`/dice d:<sides> [times:<count>] [ephemeral:<private>]`',
      notes: '`d` accepts 2–1,000,000 and `times` accepts 1–10, with a default of 1. Enable `ephemeral` to show the result only to yourself.'
    },
    'special-dice': {
      summary: 'Add or subtract a fixed modifier from a dice total.',
      usage: '`/special-dice d:<sides> effect:<plus|minus> effect-num:<modifier> [times:<count>] [ephemeral:<private>]`',
      notes: '`d` and `effect-num` accept values up to 1,000,000, and `times` accepts 1–10. The modifier is applied once to the total.'
    },
    fortune: {
      summary: 'View today’s fortune as a luck score from 1 to 100.',
      usage: '`/fortune`',
      notes: 'The first result of the day is saved. Reusing the command that day privately shows the same score and its original KST check time without rerolling.'
    },
    me: {
      summary: 'View your NOVA activity history, gacha collection, and activity level.',
      usage: '`/me`',
      notes: 'Shows command uses, dice rolled, gacha pulls, owned gachas, grades and items, fortune history, first use date, and activity score.'
    },
    'gacha-create': {
      summary: 'Create a new gacha.',
      usage: '`/gacha-create gacha_name:<name>`',
      notes: 'Names are 1–40 characters and each user can own up to 25 gachas. Add grades and items afterward with `/gacha-manage`.'
    },
    'gacha-manage': {
      summary: 'Inspect and edit grades, probabilities, colors, and items, or publish a gacha to the channel.',
      usage: '`/gacha-manage`',
      notes: 'Each gacha supports 25 grades and each grade supports 25 items. Colors accept a preset name or a six-digit hex code such as `#123456`. Probability left below 100% becomes a no-prize result. After a pull, you can use `Pull 1 again` or `Pull 10 again`.'
    },
    'gacha-delete': {
      summary: 'Select and delete one of your gachas.',
      usage: '`/gacha-delete`',
      notes: 'Deleting a gacha also permanently deletes all grades and items inside it.'
    },
    'gacha-import': {
      summary: 'Create a complete gacha, including grades and items, from one CSV or JSON file.',
      usage: '`/gacha-import file:<.json or .csv file>`',
      notes: '**JSON format**\n' +
        '```json\n' +
        '{"name":"Treasure","grades":[{"name":"Rare","percentage":20,"color":"purple","items":[{"name":"Crown","description":"A shiny crown"},"Gem"]}]}\n' +
        '```\n' +
        '**CSV format**\n' +
        '```csv\n' +
        'gacha_name,grade_name,percentage,color,item_name,item_description\n' +
        'Treasure,Rare,20,purple,Crown,A shiny crown\n' +
        'Treasure,Common,80,gray,Coin,A common coin\n' +
        '```\n' +
        'Files must be 256 KB or smaller. Colors are `gray`, `green`, `blue`, `purple`, `yellow`, or a six-digit hex code such as `#123456`; the `#` is optional. Every CSV row must use the same `gacha_name`, and repeated grades must use matching `percentage` and `color` values. Total probability cannot exceed 100%. Invalid files create no data.'
    },
    'gacha-export': {
      summary: 'Download one of your gachas as an import-compatible JSON or CSV file.',
      usage: '`/gacha-export gacha:<your gacha> [format:<JSON|CSV>]`',
      notes: 'Start typing a gacha name to use autocomplete. JSON is the default. The downloaded file preserves every grade, probability, color, item, and item description and can be uploaded again with `/gacha-import`.'
    },
    random: {
      summary: 'Pick an item, shuffle an order, draw a sample, or divide items into random teams.',
      usage: '`/random pick|order|sample|team items:<comma or new-line separated list> ...`',
      notes: 'Enter 2–40 items. `sample` draws part of the list, and `team` shuffles and distributes the items. Enable `ephemeral` to show the result only to yourself.'
    },
    embed: {
      summary: 'Combine optional properties into a custom embed and post it in the current channel.',
      usage: '`/embed [title] [description] [color] [url] [image] [thumbnail] [author] [footer] [timestamp]`',
      notes: 'Provide at least one of `title`, `description`, `author`, `footer`, `image`, or `thumbnail`. Colors accept `gray`, `green`, `blue`, `purple`, `yellow`, or a six-digit hex code such as `#123456`; the `#` is optional.'
    },
    signup: {
      summary: 'Create a public signup panel with join, leave, and close buttons.',
      usage: '`/signup title:<title> [description:<details>] [capacity:<2–50>]`',
      notes: 'Anyone can join or leave while the signup is open, and only the organizer can close it.'
    },
    settings: {
      summary: 'Configure NOVA’s response language and enabled features for the current server.',
      usage: '`/settings`',
      notes: 'Only members with Manage Server can run it inside a server. Dice, fortune, gacha, and emoji enlargement can be toggled separately. The settings screen is private.'
    }
  },
  summaryLabel: 'Description',
  usageLabel: 'Usage',
  notesLabel: 'Details'
};

const commands = {
  about: { description: 'Learn about Nova and its commands.' },
  embed: {
    description: 'Create and post a custom embed.',
    title: 'Embed title.',
    body: 'Embed description with optional Markdown.',
    color: 'Preset color name or six-digit hex code.',
    url: 'Link opened when the title is clicked.',
    image: 'HTTP or HTTPS URL for the large image.',
    thumbnail: 'HTTP or HTTPS URL for the thumbnail.',
    author: 'Author name shown above the title.',
    footer: 'Footer text shown at the bottom.',
    timestamp: 'Show the current time on the embed.'
  },
  ping: { description: 'Reply with Pong!' },
  dice: {
    description: 'Roll dice.',
    d: 'Set the number of sides.',
    times: 'Set how many dice to roll.',
    ephemeral: 'Show the result only to you.'
  },
  specialDice: {
    description: 'Roll dice with a modifier.',
    d: 'Set the number of sides.',
    effect: 'Choose whether to add or subtract the modifier.',
    effectPlus: 'Plus',
    effectMinus: 'Minus',
    effectNum: 'Set the modifier value.',
    times: 'Set how many dice to roll.',
    ephemeral: 'Show the result only to you.'
  },
  fortune: { description: "Reveal today's fortune as a lucky number." },
  me: { description: 'View your Nova activity and collection.' },
  gachaCreate: { description: 'Create a new gacha.', gachaName: 'Gacha name' },
  gachaManage: { description: 'View and manage your gachas.' },
  gachaDelete: { description: 'Delete one of your gachas.' },
  gachaImport: {
    description: 'Create a gacha from a CSV or JSON file.',
    fileName: 'file',
    fileDescription: 'A .csv or .json gacha definition (up to 256 KB).'
  },
  gachaExport: {
    description: 'Download one of your gachas as JSON or CSV.',
    gacha: 'Choose one of your gachas.',
    format: 'Choose the export file format. Defaults to JSON.'
  },
  random: {
    description: 'Make a random choice from a list.',
    pick: 'Pick one item from a list.',
    order: 'Shuffle every item into a random order.',
    sample: 'Draw several items without repeats.',
    team: 'Divide items into random teams.',
    items: 'Items separated by commas or new lines.',
    count: 'Number of items to draw.',
    teams: 'Number of teams to create.',
    ephemeral: 'Show the result only to you.'
  },
  signup: {
    description: 'Create a signup panel.',
    title: 'Title of the signup.',
    details: 'Optional details shown below the title.',
    capacity: 'Optional participant limit from 2 to 50.'
  },
  settings: { description: 'Configure Nova for this server.' }
};

module.exports = { about, commands, messages };
