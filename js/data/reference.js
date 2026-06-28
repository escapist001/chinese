/* ============================================================
   reference.js — справочные данные:
   • radicals — ключи иероглифов (部首)
   • measureWords — счётные слова (量词)
   Всё озвучивается носителем (см. tools/extract_audio.js).
   ============================================================ */
window.CN = window.CN || {};

CN.radicals = [
  { char: '人', pinyin: 'rén', meaning: 'человек', examples: ['你', '他', '们'] },
  { char: '口', pinyin: 'kǒu', meaning: 'рот', examples: ['吃', '叫', '吗'] },
  { char: '女', pinyin: 'nǚ', meaning: 'женщина', examples: ['好', '妈', '姐'] },
  { char: '子', pinyin: 'zǐ', meaning: 'ребёнок', examples: ['好', '字', '学'] },
  { char: '水', alt: '氵', pinyin: 'shuǐ', meaning: 'вода', examples: ['河', '洗', '没'] },
  { char: '火', pinyin: 'huǒ', meaning: 'огонь', examples: ['热', '灯'] },
  { char: '木', pinyin: 'mù', meaning: 'дерево', examples: ['林', '森', '桌'] },
  { char: '心', alt: '忄', pinyin: 'xīn', meaning: 'сердце', examples: ['想', '忙', '快'] },
  { char: '手', alt: '扌', pinyin: 'shǒu', meaning: 'рука', examples: ['打', '找', '拿'] },
  { char: '日', pinyin: 'rì', meaning: 'солнце / день', examples: ['明', '时', '是'] },
  { char: '月', pinyin: 'yuè', meaning: 'луна / мясо', examples: ['朋', '有', '期'] },
  { char: '目', pinyin: 'mù', meaning: 'глаз', examples: ['看', '睡'] },
  { char: '言', alt: '讠', pinyin: 'yán', meaning: 'речь', examples: ['说', '语', '谢'] },
  { char: '食', alt: '饣', pinyin: 'shí', meaning: 'еда', examples: ['饭', '饿', '馆'] },
  { char: '土', pinyin: 'tǔ', meaning: 'земля', examples: ['在', '地', '块'] },
  { char: '大', pinyin: 'dà', meaning: 'большой', examples: ['天', '太'] },
  { char: '山', pinyin: 'shān', meaning: 'гора', examples: ['出', '岁'] },
  { char: '田', pinyin: 'tián', meaning: 'поле', examples: ['男', '画'] },
  { char: '门', pinyin: 'mén', meaning: 'дверь', examples: ['们', '问', '间'] },
  { char: '马', pinyin: 'mǎ', meaning: 'лошадь', examples: ['妈', '吗'] },
];

CN.measureWords = [
  { char: '个', pinyin: 'gè', use: 'универсальное (люди, вещи)', example: { hanzi: '一个人', pinyin: 'yí gè rén', ru: 'один человек' } },
  { char: '本', pinyin: 'běn', use: 'книги, тетради', example: { hanzi: '一本书', pinyin: 'yì běn shū', ru: 'одна книга' } },
  { char: '只', pinyin: 'zhī', use: 'животные', example: { hanzi: '一只猫', pinyin: 'yì zhī māo', ru: 'одна кошка' } },
  { char: '张', pinyin: 'zhāng', use: 'плоские предметы', example: { hanzi: '一张纸', pinyin: 'yì zhāng zhǐ', ru: 'один лист бумаги' } },
  { char: '杯', pinyin: 'bēi', use: 'стаканы, чашки', example: { hanzi: '一杯水', pinyin: 'yì bēi shuǐ', ru: 'стакан воды' } },
  { char: '位', pinyin: 'wèi', use: 'вежливо о людях', example: { hanzi: '一位老师', pinyin: 'yí wèi lǎoshī', ru: 'один учитель' } },
  { char: '件', pinyin: 'jiàn', use: 'одежда, дела', example: { hanzi: '一件衣服', pinyin: 'yí jiàn yīfu', ru: 'одна одежда' } },
  { char: '条', pinyin: 'tiáo', use: 'длинные предметы', example: { hanzi: '一条鱼', pinyin: 'yì tiáo yú', ru: 'одна рыба' } },
  { char: '块', pinyin: 'kuài', use: 'куски, деньги (юань)', example: { hanzi: '一块钱', pinyin: 'yí kuài qián', ru: 'один юань' } },
  { char: '双', pinyin: 'shuāng', use: 'парные предметы', example: { hanzi: '一双鞋', pinyin: 'yì shuāng xié', ru: 'пара обуви' } },
];

/* Тёплые сюрпризы от Дани — показываются один раз при достижении рубежа.
   Текст можно свободно править. test() вызывается во время работы (store уже готов). */
CN.surprises = [
  { id: 'start', text: 'Женечка, ты начала учить китайский! Я очень горжусь тобой. 加油 ❤', test: () => CN.store.seenCount() >= 1 },
  { id: 'ten', text: 'Уже 10 слов! Ты невероятно умная. Люблю тебя ❤', test: () => CN.store.seenCount() >= 10 },
  { id: 'streak3', text: '3 дня подряд — вот это характер! Так держать, моя хорошая ❤', test: () => CN.store.get().streak.count >= 3 },
  { id: 'lesson1', text: 'Первый урок позади! Ты умница, я знал, что у тебя получится ❤', test: () => CN.units.some(u => u.lessons.some(l => CN.store.lessonPct(l) === 100)) },
  { id: 'level3', text: 'Уже 3-й уровень! Каждый твой шаг радует меня. Твой Даня ❤', test: () => CN.store.level() >= 3 },
  { id: 'fifty', text: '50 слов!! Ты потрясающая, Женя. Горжусь каждый день ❤', test: () => CN.store.seenCount() >= 50 },
];

/* Уровень курса по HSK. Сейчас весь контент — HSK 1. Будущие юниты получат свой тег. */
CN.courseLevel = 'HSK 1';
(CN.units || []).forEach(u => { if (u.hsk == null) u.hsk = 1; });

