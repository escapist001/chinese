/* ============================================================
   drills.js — данные для фонетических тренировок:
   • minimalPairs — похожие на слух слоги (для игры «что услышала?»)
   • toneSandhi   — правила изменения тонов с примерами
   Все иероглифы озвучиваются носителем (см. tools/extract_audio.js).
   ============================================================ */
window.CN = window.CN || {};

CN.minimalPairs = [
  { focus: 'Тоны: mā / má / mǎ / mà', options: [
    { hanzi: '妈', pinyin: 'mā', ru: 'мама' },
    { hanzi: '麻', pinyin: 'má', ru: 'конопля' },
    { hanzi: '马', pinyin: 'mǎ', ru: 'лошадь' },
    { hanzi: '骂', pinyin: 'mà', ru: 'ругать' },
  ] },
  { focus: 'Тоны: bā / bá / bǎ / bà', options: [
    { hanzi: '八', pinyin: 'bā', ru: 'восемь' },
    { hanzi: '拔', pinyin: 'bá', ru: 'вытаскивать' },
    { hanzi: '把', pinyin: 'bǎ', ru: 'держать' },
    { hanzi: '爸', pinyin: 'bà', ru: 'папа' },
  ] },
  { focus: 'Тоны: tāng / táng / tǎng / tàng', options: [
    { hanzi: '汤', pinyin: 'tāng', ru: 'суп' },
    { hanzi: '糖', pinyin: 'táng', ru: 'сахар' },
    { hanzi: '躺', pinyin: 'tǎng', ru: 'лежать' },
    { hanzi: '烫', pinyin: 'tàng', ru: 'обжигающий' },
  ] },
  { focus: 'Инициали: b / p', options: [
    { hanzi: '爸', pinyin: 'bà', ru: 'папа' },
    { hanzi: '怕', pinyin: 'pà', ru: 'бояться' },
  ] },
  { focus: 'Инициали: d / t', options: [
    { hanzi: '肚', pinyin: 'dù', ru: 'живот' },
    { hanzi: '兔', pinyin: 'tù', ru: 'заяц' },
  ] },
  { focus: 'Инициали: g / k', options: [
    { hanzi: '古', pinyin: 'gǔ', ru: 'древний' },
    { hanzi: '苦', pinyin: 'kǔ', ru: 'горький' },
  ] },
  { focus: 'Инициали: j / q / x', options: [
    { hanzi: '鸡', pinyin: 'jī', ru: 'курица' },
    { hanzi: '七', pinyin: 'qī', ru: 'семь' },
    { hanzi: '西', pinyin: 'xī', ru: 'запад' },
  ] },
  { focus: 'Инициали: zh / ch / sh', options: [
    { hanzi: '知', pinyin: 'zhī', ru: 'знать' },
    { hanzi: '吃', pinyin: 'chī', ru: 'есть (кушать)' },
    { hanzi: '师', pinyin: 'shī', ru: 'учитель' },
  ] },
  { focus: 'Инициали: z / c / s', options: [
    { hanzi: '早', pinyin: 'zǎo', ru: 'рано' },
    { hanzi: '草', pinyin: 'cǎo', ru: 'трава' },
    { hanzi: '嫂', pinyin: 'sǎo', ru: 'невестка' },
  ] },
  { focus: 'Финали: an / ang', options: [
    { hanzi: '三', pinyin: 'sān', ru: 'три' },
    { hanzi: '桑', pinyin: 'sāng', ru: 'тутовник' },
  ] },
  { focus: 'Финали: in / ing', options: [
    { hanzi: '心', pinyin: 'xīn', ru: 'сердце' },
    { hanzi: '星', pinyin: 'xīng', ru: 'звезда' },
  ] },
  { focus: 'Финали: en / eng', options: [
    { hanzi: '真', pinyin: 'zhēn', ru: 'настоящий' },
    { hanzi: '争', pinyin: 'zhēng', ru: 'спорить' },
  ] },
];

/* Диалоги для аудирования: послушать → ответить на вопрос. */
CN.listening = [
  {
    title: 'Приветствие',
    lines: [
      { hanzi: '你好！', pinyin: 'Nǐ hǎo!', ru: 'Привет!' },
      { hanzi: '你好！你好吗？', pinyin: 'Nǐ hǎo! Nǐ hǎo ma?', ru: 'Привет! Как дела?' },
      { hanzi: '我很好，谢谢。', pinyin: 'Wǒ hěn hǎo, xièxie.', ru: 'У меня всё хорошо, спасибо.' },
    ],
    q: 'Что сделал второй человек после приветствия?',
    options: ['Спросил, как дела', 'Попрощался', 'Назвал своё имя'],
    answer: 0,
  },
  {
    title: 'Знакомство',
    lines: [
      { hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', ru: 'Как тебя зовут?' },
      { hanzi: '我叫李娜。你呢？', pinyin: 'Wǒ jiào Lǐ Nà. Nǐ ne?', ru: 'Меня зовут Ли На. А тебя?' },
      { hanzi: '我叫王明。', pinyin: 'Wǒ jiào Wáng Míng.', ru: 'Меня зовут Ван Мин.' },
    ],
    q: 'О чём говорят собеседники?',
    options: ['Знакомятся (имена)', 'О погоде', 'О числах'],
    answer: 0,
  },
  {
    title: 'Семья',
    lines: [
      { hanzi: '你家有几个人？', pinyin: 'Nǐ jiā yǒu jǐ ge rén?', ru: 'Сколько человек в твоей семье?' },
      { hanzi: '我家有四个人。', pinyin: 'Wǒ jiā yǒu sì ge rén.', ru: 'В моей семье четыре человека.' },
    ],
    q: 'Сколько человек в семье?',
    options: ['Четыре', 'Три', 'Пять'],
    answer: 0,
  },
];

CN.toneSandhi = [
  {
    title: 'Два третьих тона подряд',
    rule: '3 + 3 → 2 + 3',
    explain: 'Когда два третьих тона идут подряд, первый превращается во второй — так легче произнести.',
    examples: [
      { hanzi: '你好', pinyin: 'nǐ hǎo → ní hǎo', ru: 'привет' },
      { hanzi: '很好', pinyin: 'hěn hǎo → hén hǎo', ru: 'очень хорошо' },
      { hanzi: '可以', pinyin: 'kě yǐ → ké yǐ', ru: 'можно' },
      { hanzi: '老鼠', pinyin: 'lǎo shǔ → láo shǔ', ru: 'мышь' },
    ],
  },
  {
    title: 'Изменение 不 (bù)',
    rule: '不 → bú перед 4-м тоном',
    explain: '«Нет/не» обычно bù, но перед четвёртым тоном становится bú.',
    examples: [
      { hanzi: '不是', pinyin: 'bú shì', ru: 'не (является)' },
      { hanzi: '不要', pinyin: 'bú yào', ru: 'не надо' },
      { hanzi: '不对', pinyin: 'bú duì', ru: 'неверно' },
      { hanzi: '不好', pinyin: 'bù hǎo', ru: 'нехорошо (остаётся bù)' },
    ],
  },
  {
    title: 'Изменение 一 (yī)',
    rule: '一 → yí перед 4-м, yì перед 1/2/3',
    explain: '«Один» в изоляции yī, но в сочетаниях меняет тон в зависимости от следующего слога.',
    examples: [
      { hanzi: '一个', pinyin: 'yí gè', ru: 'один (штука)' },
      { hanzi: '一样', pinyin: 'yí yàng', ru: 'одинаковый' },
      { hanzi: '一天', pinyin: 'yì tiān', ru: 'один день' },
      { hanzi: '一起', pinyin: 'yì qǐ', ru: 'вместе' },
    ],
  },
];
