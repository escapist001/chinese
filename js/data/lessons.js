/* ============================================================
   lessons.js — учебная программа: юниты → уроки.
   Урок: { id, title, emoji, intro, grammar{title,body}, words[], sentences[] }
   word:     { hanzi, pinyin, ru }
   sentence: { hanzi, pinyin, ru }
   Добавлять/править контент можно прямо тут — приложение подхватит.
   10 юнитов / 30 уроков — полный словарь HSK 1 (150 слов); легко расширяется.
   ============================================================ */
window.CN = window.CN || {};

CN.units = [
  /* ───────────────── ЮНИТ 1 ───────────────── */
  {
    id: 'u1', title: 'Знакомство', emoji: '👋',
    subtitle: 'Поздороваться, поблагодарить и представиться',
    lessons: [
      {
        id: 'u1l1', title: 'Приветствия', emoji: '🌅',
        intro: 'Самые первые слова: привет, доброе утро, до встречи.',
        grammar: { title: '你好 — универсальное «привет»',
          body: '你 (nǐ) — «ты», 好 (hǎo) — «хорошо». Вместе 你好 — «здравствуй». Уважительно — 您好 (nín hǎo).' },
        words: [
          { hanzi: '你好', pinyin: 'nǐ hǎo', ru: 'привет / здравствуй' },
          { hanzi: '您好', pinyin: 'nín hǎo', ru: 'здравствуйте (вежливо)' },
          { hanzi: '早上好', pinyin: 'zǎoshang hǎo', ru: 'доброе утро' },
          { hanzi: '晚上好', pinyin: 'wǎnshang hǎo', ru: 'добрый вечер' },
          { hanzi: '再见', pinyin: 'zàijiàn', ru: 'до свидания' },
          { hanzi: '明天见', pinyin: 'míngtiān jiàn', ru: 'до завтра' },
          { hanzi: '你好吗', pinyin: 'nǐ hǎo ma', ru: 'как дела?' },
          { hanzi: '我很好', pinyin: 'wǒ hěn hǎo', ru: 'у меня всё хорошо' },
        ],
        sentences: [
          { hanzi: '你好！你好吗？', pinyin: 'Nǐ hǎo! Nǐ hǎo ma?', ru: 'Привет! Как дела?' },
          { hanzi: '我很好，谢谢。', pinyin: 'Wǒ hěn hǎo, xièxie.', ru: 'У меня всё хорошо, спасибо.' },
          { hanzi: '再见，明天见！', pinyin: 'Zàijiàn, míngtiān jiàn!', ru: 'Пока, до завтра!' },
        ],
      },
      {
        id: 'u1l2', title: 'Вежливость', emoji: '🙏',
        intro: 'Спасибо, извини, пожалуйста — без них никуда.',
        grammar: { title: 'Просьба: 请 (qǐng)',
          body: '请 ставится перед действием и означает «пожалуйста»: 请进 (qǐng jìn) — «проходите», 请坐 (qǐng zuò) — «садитесь».' },
        words: [
          { hanzi: '谢谢', pinyin: 'xièxie', ru: 'спасибо' },
          { hanzi: '不客气', pinyin: 'bú kèqi', ru: 'не за что' },
          { hanzi: '对不起', pinyin: 'duìbuqǐ', ru: 'извини(те)' },
          { hanzi: '没关系', pinyin: 'méi guānxi', ru: 'ничего страшного' },
          { hanzi: '请', pinyin: 'qǐng', ru: 'пожалуйста (просьба)' },
          { hanzi: '请问', pinyin: 'qǐngwèn', ru: 'позвольте спросить' },
          { hanzi: '没问题', pinyin: 'méi wèntí', ru: 'без проблем' },
        ],
        sentences: [
          { hanzi: '谢谢你！— 不客气。', pinyin: 'Xièxie nǐ! — Bú kèqi.', ru: 'Спасибо! — Не за что.' },
          { hanzi: '对不起。— 没关系。', pinyin: 'Duìbuqǐ. — Méi guānxi.', ru: 'Извини. — Ничего страшного.' },
          { hanzi: '请问，你叫什么名字？', pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?', ru: 'Позвольте спросить, как тебя зовут?' },
        ],
      },
      {
        id: 'u1l3', title: 'Давай познакомимся', emoji: '🤝',
        intro: 'Назвать имя и спросить чужое.',
        grammar: { title: 'Имя: 我叫… (wǒ jiào…)',
          body: '叫 (jiào) — «зваться». 我叫 + имя = «меня зовут …». Вопрос: 你叫什么名字？(nǐ jiào shénme míngzi) — «как тебя зовут?».' },
        words: [
          { hanzi: '我', pinyin: 'wǒ', ru: 'я' },
          { hanzi: '你', pinyin: 'nǐ', ru: 'ты' },
          { hanzi: '叫', pinyin: 'jiào', ru: 'зваться' },
          { hanzi: '什么', pinyin: 'shénme', ru: 'что / какой' },
          { hanzi: '名字', pinyin: 'míngzi', ru: 'имя' },
          { hanzi: '认识', pinyin: 'rènshi', ru: 'быть знакомым' },
          { hanzi: '高兴', pinyin: 'gāoxìng', ru: 'рад(а)' },
        ],
        sentences: [
          { hanzi: '你叫什么名字？', pinyin: 'Nǐ jiào shénme míngzi?', ru: 'Как тебя зовут?' },
          { hanzi: '我叫 ___。', pinyin: 'Wǒ jiào ___.', ru: 'Меня зовут ___.' },
          { hanzi: '认识你很高兴！', pinyin: 'Rènshi nǐ hěn gāoxìng!', ru: 'Рад(а) знакомству!' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 2 ───────────────── */
  {
    id: 'u2', title: 'Люди и семья', emoji: '👨‍👩‍👧',
    subtitle: 'Местоимения, родные, страны',
    lessons: [
      {
        id: 'u2l1', title: 'Местоимения', emoji: '🧑',
        intro: 'Я, ты, он, она и множественное число.',
        grammar: { title: 'Множественное: + 们 (men)',
          body: 'Чтобы сделать «мы/вы/они», к 我/你/他 добавляют 们: 我们 (мы), 你们 (вы), 他们 (они).' },
        words: [
          { hanzi: '我', pinyin: 'wǒ', ru: 'я' },
          { hanzi: '你', pinyin: 'nǐ', ru: 'ты' },
          { hanzi: '他', pinyin: 'tā', ru: 'он' },
          { hanzi: '她', pinyin: 'tā', ru: 'она' },
          { hanzi: '它', pinyin: 'tā', ru: 'оно (предмет/животное)' },
          { hanzi: '我们', pinyin: 'wǒmen', ru: 'мы' },
          { hanzi: '你们', pinyin: 'nǐmen', ru: 'вы (мн.)' },
          { hanzi: '他们', pinyin: 'tāmen', ru: 'они' },
        ],
        sentences: [
          { hanzi: '他是我朋友。', pinyin: 'Tā shì wǒ péngyou.', ru: 'Он мой друг.' },
          { hanzi: '我们是学生。', pinyin: 'Wǒmen shì xuéshēng.', ru: 'Мы студенты.' },
        ],
      },
      {
        id: 'u2l2', title: 'Семья', emoji: '👪',
        intro: 'Самые близкие люди.',
        grammar: { title: 'Притяжение: 的 (de)',
          body: '的 показывает принадлежность: 我的妈妈 (wǒ de māma) — «моя мама». С близкими родными 的 часто опускают: 我妈妈.' },
        words: [
          { hanzi: '爸爸', pinyin: 'bàba', ru: 'папа' },
          { hanzi: '妈妈', pinyin: 'māma', ru: 'мама' },
          { hanzi: '哥哥', pinyin: 'gēge', ru: 'старший брат' },
          { hanzi: '姐姐', pinyin: 'jiějie', ru: 'старшая сестра' },
          { hanzi: '弟弟', pinyin: 'dìdi', ru: 'младший брат' },
          { hanzi: '妹妹', pinyin: 'mèimei', ru: 'младшая сестра' },
          { hanzi: '家', pinyin: 'jiā', ru: 'дом / семья' },
          { hanzi: '爱', pinyin: 'ài', ru: 'любить' },
        ],
        sentences: [
          { hanzi: '这是我妈妈。', pinyin: 'Zhè shì wǒ māma.', ru: 'Это моя мама.' },
          { hanzi: '我爱我的家。', pinyin: 'Wǒ ài wǒ de jiā.', ru: 'Я люблю свою семью.' },
        ],
      },
      {
        id: 'u2l3', title: 'Страны и языки', emoji: '🌏',
        intro: 'Откуда ты и на каком говоришь.',
        grammar: { title: 'Откуда: 哪国人 (nǎ guó rén)',
          body: '国 (guó) — «страна», 人 (rén) — «человек». 中国人 — «китаец». Вопрос: 你是哪国人？— «ты из какой страны?».' },
        words: [
          { hanzi: '中国', pinyin: 'Zhōngguó', ru: 'Китай' },
          { hanzi: '俄罗斯', pinyin: 'Éluósī', ru: 'Россия' },
          { hanzi: '美国', pinyin: 'Měiguó', ru: 'США' },
          { hanzi: '人', pinyin: 'rén', ru: 'человек' },
          { hanzi: '中文', pinyin: 'Zhōngwén', ru: 'китайский язык' },
          { hanzi: '英文', pinyin: 'Yīngwén', ru: 'английский язык' },
          { hanzi: '会', pinyin: 'huì', ru: 'уметь' },
        ],
        sentences: [
          { hanzi: '我是俄罗斯人。', pinyin: 'Wǒ shì Éluósī rén.', ru: 'Я из России.' },
          { hanzi: '我会说一点儿中文。', pinyin: 'Wǒ huì shuō yìdiǎnr Zhōngwén.', ru: 'Я немного говорю по-китайски.' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 3 ───────────────── */
  {
    id: 'u3', title: 'Числа и время', emoji: '🔢',
    subtitle: 'Счёт, часы, дни недели и даты',
    lessons: [
      {
        id: 'u3l1', title: 'Числа 0–10', emoji: '✋',
        intro: 'Фундамент всего счёта.',
        grammar: { title: 'Числа 11–99 — это сложение',
          body: '11 = 十一 (10+1), 20 = 二十 (2×10), 35 = 三十五 (3×10+5). Зная 1–10, считаешь до 99.' },
        words: [
          { hanzi: '零', pinyin: 'líng', ru: '0' }, { hanzi: '一', pinyin: 'yī', ru: '1' },
          { hanzi: '二', pinyin: 'èr', ru: '2' }, { hanzi: '三', pinyin: 'sān', ru: '3' },
          { hanzi: '四', pinyin: 'sì', ru: '4' }, { hanzi: '五', pinyin: 'wǔ', ru: '5' },
          { hanzi: '六', pinyin: 'liù', ru: '6' }, { hanzi: '七', pinyin: 'qī', ru: '7' },
          { hanzi: '八', pinyin: 'bā', ru: '8' }, { hanzi: '九', pinyin: 'jiǔ', ru: '9' },
          { hanzi: '十', pinyin: 'shí', ru: '10' },
        ],
        sentences: [
          { hanzi: '三 + 四 = 七', pinyin: 'sān jiā sì děngyú qī', ru: '3 + 4 = 7' },
          { hanzi: '我有两个哥哥。', pinyin: 'Wǒ yǒu liǎng ge gēge.', ru: 'У меня два старших брата.' },
        ],
      },
      {
        id: 'u3l2', title: 'Дни недели', emoji: '📅',
        intro: 'Неделя строится из чисел — удобно!',
        grammar: { title: '星期 + число',
          body: '星期一 — понедельник (неделя-1), 星期二 — вторник… 星期日/星期天 — воскресенье. Просто число после 星期.' },
        words: [
          { hanzi: '星期', pinyin: 'xīngqī', ru: 'неделя' },
          { hanzi: '星期一', pinyin: 'xīngqīyī', ru: 'понедельник' },
          { hanzi: '星期三', pinyin: 'xīngqīsān', ru: 'среда' },
          { hanzi: '星期五', pinyin: 'xīngqīwǔ', ru: 'пятница' },
          { hanzi: '星期日', pinyin: 'xīngqīrì', ru: 'воскресенье' },
          { hanzi: '今天', pinyin: 'jīntiān', ru: 'сегодня' },
          { hanzi: '明天', pinyin: 'míngtiān', ru: 'завтра' },
          { hanzi: '昨天', pinyin: 'zuótiān', ru: 'вчера' },
        ],
        sentences: [
          { hanzi: '今天星期几？', pinyin: 'Jīntiān xīngqī jǐ?', ru: 'Какой сегодня день недели?' },
          { hanzi: '明天是星期五。', pinyin: 'Míngtiān shì xīngqīwǔ.', ru: 'Завтра пятница.' },
        ],
      },
      {
        id: 'u3l3', title: 'Который час', emoji: '🕒',
        intro: 'Время на часах.',
        grammar: { title: '点 (diǎn) — «час»',
          body: '两点 — 2 часа, 三点半 (bàn) — полтретьего. 分 (fēn) — минуты: 八点十分 — 8:10.' },
        words: [
          { hanzi: '现在', pinyin: 'xiànzài', ru: 'сейчас' },
          { hanzi: '点', pinyin: 'diǎn', ru: 'час (на часах)' },
          { hanzi: '分', pinyin: 'fēn', ru: 'минута' },
          { hanzi: '半', pinyin: 'bàn', ru: 'половина' },
          { hanzi: '上午', pinyin: 'shàngwǔ', ru: 'до полудня' },
          { hanzi: '下午', pinyin: 'xiàwǔ', ru: 'после полудня' },
          { hanzi: '几点', pinyin: 'jǐ diǎn', ru: 'который час' },
        ],
        sentences: [
          { hanzi: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?', ru: 'Который сейчас час?' },
          { hanzi: '现在三点半。', pinyin: 'Xiànzài sān diǎn bàn.', ru: 'Сейчас полчетвёртого.' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 4 ───────────────── */
  {
    id: 'u4', title: 'Каждый день', emoji: '💬',
    subtitle: 'Главные глаголы и фразы на каждый день',
    lessons: [
      {
        id: 'u4l1', title: 'Быть, иметь, хотеть', emoji: '⭐',
        intro: 'Три самых частых глагола.',
        grammar: { title: '是 / 有 / 不 / 没',
          body: '是 (shì) — «быть»: 我是学生. 有 (yǒu) — «иметь»: 我有书. Отрицание: 不是 (не есть), 没有 (не иметь).' },
        words: [
          { hanzi: '是', pinyin: 'shì', ru: 'быть, являться' },
          { hanzi: '有', pinyin: 'yǒu', ru: 'иметь, есть' },
          { hanzi: '在', pinyin: 'zài', ru: 'находиться в' },
          { hanzi: '想', pinyin: 'xiǎng', ru: 'хотеть, думать' },
          { hanzi: '要', pinyin: 'yào', ru: 'хотеть, нужно' },
          { hanzi: '不', pinyin: 'bù', ru: 'не' },
          { hanzi: '没', pinyin: 'méi', ru: 'не (с 有)' },
        ],
        sentences: [
          { hanzi: '我是学生。', pinyin: 'Wǒ shì xuéshēng.', ru: 'Я студент.' },
          { hanzi: '我没有时间。', pinyin: 'Wǒ méiyǒu shíjiān.', ru: 'У меня нет времени.' },
          { hanzi: '我想喝茶。', pinyin: 'Wǒ xiǎng hē chá.', ru: 'Я хочу выпить чаю.' },
        ],
      },
      {
        id: 'u4l2', title: 'Действия', emoji: '🏃',
        intro: 'Идти, есть, смотреть, говорить, учиться.',
        grammar: { title: 'Порядок слов: Кто + Действие + Что',
          body: 'Китайский строг: подлежащее — сказуемое — дополнение. 我 (я) 喝 (пью) 水 (воду) = «Я пью воду».' },
        words: [
          { hanzi: '去', pinyin: 'qù', ru: 'идти, ехать' },
          { hanzi: '来', pinyin: 'lái', ru: 'приходить' },
          { hanzi: '吃', pinyin: 'chī', ru: 'есть' },
          { hanzi: '喝', pinyin: 'hē', ru: 'пить' },
          { hanzi: '看', pinyin: 'kàn', ru: 'смотреть, читать' },
          { hanzi: '说', pinyin: 'shuō', ru: 'говорить' },
          { hanzi: '学习', pinyin: 'xuéxí', ru: 'учиться' },
          { hanzi: '工作', pinyin: 'gōngzuò', ru: 'работать' },
        ],
        sentences: [
          { hanzi: '我去学校。', pinyin: 'Wǒ qù xuéxiào.', ru: 'Я иду в школу.' },
          { hanzi: '你想吃什么？', pinyin: 'Nǐ xiǎng chī shénme?', ru: 'Что ты хочешь поесть?' },
        ],
      },
      {
        id: 'u4l3', title: 'Нравится', emoji: '❤️',
        intro: 'Говорим о том, что любим.',
        grammar: { title: '喜欢 (xǐhuan) + что/действие',
          body: '喜欢 — «нравиться». После него — предмет или другой глагол: 我喜欢咖啡 / 我喜欢学中文.' },
        words: [
          { hanzi: '喜欢', pinyin: 'xǐhuan', ru: 'нравиться, любить' },
          { hanzi: '爱', pinyin: 'ài', ru: 'любить (сильно)' },
          { hanzi: '朋友', pinyin: 'péngyou', ru: 'друг' },
          { hanzi: '音乐', pinyin: 'yīnyuè', ru: 'музыка' },
          { hanzi: '电影', pinyin: 'diànyǐng', ru: 'кино' },
          { hanzi: '很', pinyin: 'hěn', ru: 'очень' },
          { hanzi: '也', pinyin: 'yě', ru: 'тоже' },
        ],
        sentences: [
          { hanzi: '我很喜欢音乐。', pinyin: 'Wǒ hěn xǐhuan yīnyuè.', ru: 'Я очень люблю музыку.' },
          { hanzi: '我也喜欢你。', pinyin: 'Wǒ yě xǐhuan nǐ.', ru: 'Ты мне тоже нравишься.' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 5 ───────────────── */
  {
    id: 'u5', title: 'Мир вокруг', emoji: '🍜',
    subtitle: 'Еда, цвета и покупки',
    lessons: [
      {
        id: 'u5l1', title: 'Еда и напитки', emoji: '🍚',
        intro: 'Заказать поесть и попить.',
        grammar: { title: 'Заказ: 我要 + еда',
          body: '我要 (wǒ yào) — «я буду / мне нужно». В кафе: 我要一杯茶 — «мне чашку чая». 杯 (bēi) — счётное слово для чашек.' },
        words: [
          { hanzi: '米饭', pinyin: 'mǐfàn', ru: 'варёный рис' },
          { hanzi: '面条', pinyin: 'miàntiáo', ru: 'лапша' },
          { hanzi: '水', pinyin: 'shuǐ', ru: 'вода' },
          { hanzi: '茶', pinyin: 'chá', ru: 'чай' },
          { hanzi: '咖啡', pinyin: 'kāfēi', ru: 'кофе' },
          { hanzi: '苹果', pinyin: 'píngguǒ', ru: 'яблоко' },
          { hanzi: '鸡蛋', pinyin: 'jīdàn', ru: 'яйцо' },
          { hanzi: '好吃', pinyin: 'hǎochī', ru: 'вкусный' },
        ],
        sentences: [
          { hanzi: '我要一杯咖啡。', pinyin: 'Wǒ yào yì bēi kāfēi.', ru: 'Мне чашку кофе.' },
          { hanzi: '这个面条很好吃。', pinyin: 'Zhège miàntiáo hěn hǎochī.', ru: 'Эта лапша очень вкусная.' },
        ],
      },
      {
        id: 'u5l2', title: 'Цвета', emoji: '🎨',
        intro: 'Базовая палитра.',
        grammar: { title: 'Цвет + 色 (sè)',
          body: '色 — «цвет». 红色 — красный, 蓝色 — синий. Перед существительным добавляют 的: 红色的花 — «красный цветок».' },
        words: [
          { hanzi: '红色', pinyin: 'hóngsè', ru: 'красный' },
          { hanzi: '蓝色', pinyin: 'lánsè', ru: 'синий' },
          { hanzi: '白色', pinyin: 'báisè', ru: 'белый' },
          { hanzi: '黑色', pinyin: 'hēisè', ru: 'чёрный' },
          { hanzi: '绿色', pinyin: 'lǜsè', ru: 'зелёный' },
          { hanzi: '黄色', pinyin: 'huángsè', ru: 'жёлтый' },
          { hanzi: '颜色', pinyin: 'yánsè', ru: 'цвет' },
        ],
        sentences: [
          { hanzi: '我喜欢蓝色。', pinyin: 'Wǒ xǐhuan lánsè.', ru: 'Мне нравится синий.' },
          { hanzi: '这是红色的花。', pinyin: 'Zhè shì hóngsè de huā.', ru: 'Это красный цветок.' },
        ],
      },
      {
        id: 'u5l3', title: 'Покупки', emoji: '🛍️',
        intro: 'Спросить цену и купить.',
        grammar: { title: 'Сколько стоит: 多少钱 (duōshao qián)',
          body: '多少 — «сколько», 钱 — «деньги». 块 (kuài) — разговорное «юань». 这个多少钱？— «сколько это стоит?».' },
        words: [
          { hanzi: '钱', pinyin: 'qián', ru: 'деньги' },
          { hanzi: '多少', pinyin: 'duōshao', ru: 'сколько' },
          { hanzi: '块', pinyin: 'kuài', ru: 'юань (разг.)' },
          { hanzi: '买', pinyin: 'mǎi', ru: 'покупать' },
          { hanzi: '这个', pinyin: 'zhège', ru: 'это, этот' },
          { hanzi: '那个', pinyin: 'nàge', ru: 'то, тот' },
          { hanzi: '贵', pinyin: 'guì', ru: 'дорогой' },
          { hanzi: '便宜', pinyin: 'piányi', ru: 'дешёвый' },
        ],
        sentences: [
          { hanzi: '这个多少钱？', pinyin: 'Zhège duōshao qián?', ru: 'Сколько это стоит?' },
          { hanzi: '太贵了！', pinyin: 'Tài guì le!', ru: 'Слишком дорого!' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 6 ───────────────── */
  {
    id: 'u6', title: 'Грамматика-базис', emoji: '🧩',
    subtitle: 'Вопросы и главные конструкции',
    lessons: [
      {
        id: 'u6l1', title: 'Вопросительные слова', emoji: '❓',
        intro: 'Что, кто, где, сколько.',
        grammar: { title: 'Вопрос без перестановки',
          body: 'В китайском порядок слов не меняется. Просто ставишь вопросительное слово на место ответа: 你去哪儿？(ты идёшь куда?).' },
        words: [
          { hanzi: '什么', pinyin: 'shénme', ru: 'что' },
          { hanzi: '谁', pinyin: 'shéi', ru: 'кто' },
          { hanzi: '哪儿', pinyin: 'nǎr', ru: 'где / куда' },
          { hanzi: '几', pinyin: 'jǐ', ru: 'сколько (до 10)' },
          { hanzi: '多少', pinyin: 'duōshao', ru: 'сколько (много)' },
          { hanzi: '怎么', pinyin: 'zěnme', ru: 'как' },
          { hanzi: '为什么', pinyin: 'wèishénme', ru: 'почему' },
        ],
        sentences: [
          { hanzi: '你去哪儿？', pinyin: 'Nǐ qù nǎr?', ru: 'Ты куда идёшь?' },
          { hanzi: '这是谁？', pinyin: 'Zhè shì shéi?', ru: 'Кто это?' },
        ],
      },
      {
        id: 'u6l2', title: 'Частица 吗 и 的', emoji: '🔧',
        intro: 'Два кирпичика, которые встретишь всюду.',
        grammar: { title: '吗 — превращает фразу в вопрос',
          body: 'Добавь 吗 (ma) в конец утверждения — получишь вопрос «да/нет»: 你好 → 你好吗？ 你是学生 → 你是学生吗？' },
        words: [
          { hanzi: '吗', pinyin: 'ma', ru: 'вопрос. частица (да/нет)' },
          { hanzi: '的', pinyin: 'de', ru: 'частица принадлежности' },
          { hanzi: '呢', pinyin: 'ne', ru: 'а …? (встречный вопрос)' },
          { hanzi: '了', pinyin: 'le', ru: 'частица завершённости' },
          { hanzi: '和', pinyin: 'hé', ru: 'и (между предметами)' },
          { hanzi: '都', pinyin: 'dōu', ru: 'всё, все' },
        ],
        sentences: [
          { hanzi: '你是老师吗？', pinyin: 'Nǐ shì lǎoshī ma?', ru: 'Ты учитель?' },
          { hanzi: '我很好，你呢？', pinyin: 'Wǒ hěn hǎo, nǐ ne?', ru: 'У меня всё хорошо, а у тебя?' },
        ],
      },
      {
        id: 'u6l3', title: 'Счётные слова', emoji: '🧮',
        intro: 'Между числом и предметом нужен «классификатор».',
        grammar: { title: 'Число + 个 + предмет',
          body: '个 (ge) — самое универсальное счётное слово: 一个人 (один человек), 三个苹果 (три яблока). У книг своё — 本 (běn): 两本书.' },
        words: [
          { hanzi: '个', pinyin: 'ge', ru: 'штука (универс.)' },
          { hanzi: '本', pinyin: 'běn', ru: 'счётное для книг' },
          { hanzi: '杯', pinyin: 'bēi', ru: 'счётное для чашек' },
          { hanzi: '两', pinyin: 'liǎng', ru: 'два (перед счётным)' },
          { hanzi: '书', pinyin: 'shū', ru: 'книга' },
          { hanzi: '人', pinyin: 'rén', ru: 'человек' },
        ],
        sentences: [
          { hanzi: '我要两个苹果。', pinyin: 'Wǒ yào liǎng ge píngguǒ.', ru: 'Мне два яблока.' },
          { hanzi: '我有三本书。', pinyin: 'Wǒ yǒu sān běn shū.', ru: 'У меня три книги.' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 7 ───────────────── */
  {
    id: 'u7', title: 'Город и места', emoji: '🏙️',
    subtitle: 'Места в городе, транспорт и где что находится',
    lessons: [
      {
        id: 'u7l1', title: 'Места в городе', emoji: '🏥',
        intro: 'Магазин, ресторан, больница — куда мы ходим.',
        grammar: { title: 'Где находится: 在 + место',
          body: '在 (zài) — «находиться в». 医院在哪儿？(Yīyuàn zài nǎr?) — «Где больница?». Ответ: 医院在前面 — «больница впереди».' },
        words: [
          { hanzi: '商店', pinyin: 'shāngdiàn', ru: 'магазин' },
          { hanzi: '饭店', pinyin: 'fàndiàn', ru: 'ресторан / гостиница' },
          { hanzi: '医院', pinyin: 'yīyuàn', ru: 'больница' },
          { hanzi: '医生', pinyin: 'yīshēng', ru: 'врач' },
          { hanzi: '学校', pinyin: 'xuéxiào', ru: 'школа' },
          { hanzi: '北京', pinyin: 'Běijīng', ru: 'Пекин' },
        ],
        sentences: [
          { hanzi: '医院在哪儿？', pinyin: 'Yīyuàn zài nǎr?', ru: 'Где больница?' },
          { hanzi: '我去商店买东西。', pinyin: 'Wǒ qù shāngdiàn mǎi dōngxi.', ru: 'Я иду в магазин за покупками.' },
          { hanzi: '他是医生。', pinyin: 'Tā shì yīshēng.', ru: 'Он врач.' },
        ],
      },
      {
        id: 'u7l2', title: 'Транспорт', emoji: '🚕',
        intro: 'Как добраться: на чём поедем.',
        grammar: { title: 'Ехать на чём-то: 坐 + транспорт',
          body: '坐 (zuò) — буквально «сидеть», но с транспортом значит «ехать/лететь»: 坐飞机 — «лететь самолётом», 坐出租车 — «ехать на такси». 开 (kāi) — «вести» машину или «открывать».' },
        words: [
          { hanzi: '出租车', pinyin: 'chūzūchē', ru: 'такси' },
          { hanzi: '飞机', pinyin: 'fēijī', ru: 'самолёт' },
          { hanzi: '火车站', pinyin: 'huǒchēzhàn', ru: 'вокзал' },
          { hanzi: '坐', pinyin: 'zuò', ru: 'сидеть; ехать (на транспорте)' },
          { hanzi: '开', pinyin: 'kāi', ru: 'открывать; вести (машину)' },
        ],
        sentences: [
          { hanzi: '我坐飞机去北京。', pinyin: 'Wǒ zuò fēijī qù Běijīng.', ru: 'Я лечу в Пекин на самолёте.' },
          { hanzi: '火车站在前面。', pinyin: 'Huǒchēzhàn zài qiánmiàn.', ru: 'Вокзал впереди.' },
          { hanzi: '我们坐出租车吧。', pinyin: 'Wǒmen zuò chūzūchē ba.', ru: 'Давай поедем на такси.' },
        ],
      },
      {
        id: 'u7l3', title: 'Где это?', emoji: '🧭',
        intro: 'Внутри, сверху, снизу, спереди, сзади.',
        grammar: { title: 'Предмет + 在 + ориентир + 里/上/下',
          body: 'Слова места ставятся ПОСЛЕ ориентира: 桌子上 — «на столе», 椅子下 — «под стулом», 书里 — «в книге». 这 (zhè) — «это», 那 (nà) — «то».' },
        words: [
          { hanzi: '里', pinyin: 'lǐ', ru: 'внутри' },
          { hanzi: '上', pinyin: 'shàng', ru: 'на / сверху' },
          { hanzi: '下', pinyin: 'xià', ru: 'под / снизу' },
          { hanzi: '前面', pinyin: 'qiánmiàn', ru: 'впереди' },
          { hanzi: '后面', pinyin: 'hòumiàn', ru: 'сзади' },
          { hanzi: '这', pinyin: 'zhè', ru: 'это, этот' },
          { hanzi: '那', pinyin: 'nà', ru: 'то, тот' },
        ],
        sentences: [
          { hanzi: '书在桌子上。', pinyin: 'Shū zài zhuōzi shàng.', ru: 'Книга на столе.' },
          { hanzi: '猫在椅子下。', pinyin: 'Māo zài yǐzi xià.', ru: 'Кошка под стулом.' },
          { hanzi: '老师在前面。', pinyin: 'Lǎoshī zài qiánmiàn.', ru: 'Учитель впереди.' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 8 ───────────────── */
  {
    id: 'u8', title: 'Дом и вещи', emoji: '🏠',
    subtitle: 'Предметы дома, питомцы, еда и учёба',
    lessons: [
      {
        id: 'u8l1', title: 'Вещи дома', emoji: '🪑',
        intro: 'Что окружает нас в комнате.',
        grammar: { title: 'Это / то есть…: 这是… / 那是…',
          body: '这是 (zhè shì) — «это есть…», 那是 (nà shì) — «то есть…». 东西 (dōngxi) — «вещь, штука» (обрати внимание: тут 西 читается лёгким тоном).' },
        words: [
          { hanzi: '杯子', pinyin: 'bēizi', ru: 'чашка, стакан' },
          { hanzi: '桌子', pinyin: 'zhuōzi', ru: 'стол' },
          { hanzi: '椅子', pinyin: 'yǐzi', ru: 'стул' },
          { hanzi: '电脑', pinyin: 'diànnǎo', ru: 'компьютер' },
          { hanzi: '电视', pinyin: 'diànshì', ru: 'телевизор' },
          { hanzi: '东西', pinyin: 'dōngxi', ru: 'вещь, предмет' },
        ],
        sentences: [
          { hanzi: '这是我的电脑。', pinyin: 'Zhè shì wǒ de diànnǎo.', ru: 'Это мой компьютер.' },
          { hanzi: '桌子上有一个杯子。', pinyin: 'Zhuōzi shàng yǒu yí ge bēizi.', ru: 'На столе стоит чашка.' },
          { hanzi: '我喜欢看电视。', pinyin: 'Wǒ xǐhuan kàn diànshì.', ru: 'Я люблю смотреть телевизор.' },
        ],
      },
      {
        id: 'u8l2', title: 'Питомцы, еда, одежда', emoji: '🐱',
        intro: 'Животные, фрукты и что носим.',
        grammar: { title: '(一)些 — «немного, несколько»',
          body: '些 (xiē) ставят после 一 или 这/那: 一些水果 — «немного фруктов», 这些 — «эти». В отличие от чисел, со 些 счётное слово не нужно.' },
        words: [
          { hanzi: '衣服', pinyin: 'yīfu', ru: 'одежда' },
          { hanzi: '狗', pinyin: 'gǒu', ru: 'собака' },
          { hanzi: '猫', pinyin: 'māo', ru: 'кошка' },
          { hanzi: '水果', pinyin: 'shuǐguǒ', ru: 'фрукты' },
          { hanzi: '菜', pinyin: 'cài', ru: 'еда, блюдо; овощи' },
        ],
        sentences: [
          { hanzi: '我喜欢狗和猫。', pinyin: 'Wǒ xǐhuan gǒu hé māo.', ru: 'Я люблю собак и кошек.' },
          { hanzi: '我要买一些水果。', pinyin: 'Wǒ yào mǎi yìxiē shuǐguǒ.', ru: 'Я хочу купить немного фруктов.' },
          { hanzi: '这是我的新衣服。', pinyin: 'Zhè shì wǒ de xīn yīfu.', ru: 'Это моя новая одежда.' },
        ],
      },
      {
        id: 'u8l3', title: 'Иероглифы и навыки', emoji: '✍️',
        intro: 'Слушать, читать, писать — учим китайский.',
        grammar: { title: '看 vs 看见 (результат)',
          body: '看 (kàn) — «смотреть» (процесс), а 看见 (kànjiàn) — «увидеть» (результат, заметил). Так же 听 (tīng) «слушать» → 听见 «услышать». 汉语 (Hànyǔ) — «китайский язык».' },
        words: [
          { hanzi: '字', pinyin: 'zì', ru: 'иероглиф, буква' },
          { hanzi: '写', pinyin: 'xiě', ru: 'писать' },
          { hanzi: '读', pinyin: 'dú', ru: 'читать (вслух)' },
          { hanzi: '听', pinyin: 'tīng', ru: 'слушать' },
          { hanzi: '看见', pinyin: 'kànjiàn', ru: 'увидеть' },
          { hanzi: '汉语', pinyin: 'Hànyǔ', ru: 'китайский язык' },
        ],
        sentences: [
          { hanzi: '我会写汉字。', pinyin: 'Wǒ huì xiě Hànzì.', ru: 'Я умею писать иероглифы.' },
          { hanzi: '我在学习汉语。', pinyin: 'Wǒ zài xuéxí Hànyǔ.', ru: 'Я учу китайский.' },
          { hanzi: '你听见了吗？', pinyin: 'Nǐ tīngjiàn le ma?', ru: 'Ты услышал?' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 9 ───────────────── */
  {
    id: 'u9', title: 'Действия и люди', emoji: '🗣️',
    subtitle: 'Бытовые глаголы, телефон и кто есть кто',
    lessons: [
      {
        id: 'u9l1', title: 'Бытовые глаголы', emoji: '🛏️',
        intro: 'Делать, жить, возвращаться, спать.',
        grammar: { title: 'Прямо сейчас: 在 + глагол',
          body: '在 (zài) перед глаголом показывает действие в процессе: 他在睡觉 — «он (сейчас) спит», 我在做饭 — «я готовлю». 住 (zhù) — «жить, проживать».' },
        words: [
          { hanzi: '做', pinyin: 'zuò', ru: 'делать' },
          { hanzi: '住', pinyin: 'zhù', ru: 'жить, проживать' },
          { hanzi: '回', pinyin: 'huí', ru: 'возвращаться' },
          { hanzi: '睡觉', pinyin: 'shuìjiào', ru: 'спать' },
          { hanzi: '说话', pinyin: 'shuōhuà', ru: 'разговаривать' },
        ],
        sentences: [
          { hanzi: '你住在哪儿？', pinyin: 'Nǐ zhù zài nǎr?', ru: 'Где ты живёшь?' },
          { hanzi: '我要回家。', pinyin: 'Wǒ yào huí jiā.', ru: 'Я хочу домой.' },
          { hanzi: '妹妹在睡觉。', pinyin: 'Mèimei zài shuìjiào.', ru: 'Младшая сестра спит.' },
        ],
      },
      {
        id: 'u9l2', title: 'Телефон и «могу»', emoji: '📞',
        intro: 'Позвонить и сказать «могу».',
        grammar: { title: '能 (мочь) vs 会 (уметь)',
          body: '能 (néng) — «мочь» по обстоятельствам/физически: 我今天能来 — «сегодня я могу прийти». 会 (huì) — «уметь» как навык: 我会说中文. 喂 (wéi) — «алло» по телефону.' },
        words: [
          { hanzi: '打电话', pinyin: 'dǎ diànhuà', ru: 'звонить по телефону' },
          { hanzi: '喂', pinyin: 'wéi', ru: 'алло' },
          { hanzi: '能', pinyin: 'néng', ru: 'мочь, быть в состоянии' },
        ],
        sentences: [
          { hanzi: '喂，你好！', pinyin: 'Wéi, nǐ hǎo!', ru: 'Алло, здравствуйте!' },
          { hanzi: '你能来吗？', pinyin: 'Nǐ néng lái ma?', ru: 'Ты можешь прийти?' },
          { hanzi: '我想打电话。', pinyin: 'Wǒ xiǎng dǎ diànhuà.', ru: 'Я хочу позвонить.' },
        ],
      },
      {
        id: 'u9l3', title: 'Семья и люди', emoji: '👨‍👩‍👧',
        intro: 'Сын, дочь, учитель, одноклассник.',
        grammar: { title: 'Обращение: фамилия + 先生 / 小姐 / 老师',
          body: 'Вежливое обращение ставят ПОСЛЕ фамилии: 王先生 — «господин Ван», 李小姐 — «госпожа Ли», 张老师 — «учитель Чжан».' },
        words: [
          { hanzi: '儿子', pinyin: 'érzi', ru: 'сын' },
          { hanzi: '女儿', pinyin: 'nǚ\'ér', ru: 'дочь' },
          { hanzi: '先生', pinyin: 'xiānsheng', ru: 'господин; муж' },
          { hanzi: '小姐', pinyin: 'xiǎojiě', ru: 'девушка, госпожа' },
          { hanzi: '同学', pinyin: 'tóngxué', ru: 'одноклассник' },
          { hanzi: '老师', pinyin: 'lǎoshī', ru: 'учитель' },
          { hanzi: '学生', pinyin: 'xuésheng', ru: 'ученик, студент' },
        ],
        sentences: [
          { hanzi: '这是我儿子和女儿。', pinyin: 'Zhè shì wǒ érzi hé nǚ\'ér.', ru: 'Это мои сын и дочь.' },
          { hanzi: '王老师是我们的老师。', pinyin: 'Wáng lǎoshī shì wǒmen de lǎoshī.', ru: 'Учитель Ван — наш учитель.' },
          { hanzi: '他是我的同学。', pinyin: 'Tā shì wǒ de tóngxué.', ru: 'Он мой одноклассник.' },
        ],
      },
    ],
  },

  /* ───────────────── ЮНИТ 10 ───────────────── */
  {
    id: 'u10', title: 'Описания и время', emoji: '🌤️',
    subtitle: 'Какой, погода, даты и возраст',
    lessons: [
      {
        id: 'u10l1', title: 'Какой? (прилагательные)', emoji: '📏',
        intro: 'Большой-маленький, жарко-холодно, много-мало.',
        grammar: { title: 'Прилагательное БЕЗ 是, но с 很',
          body: 'С прилагательным глагол «быть» не нужен: говорят 今天很热 (а не 今天是热). 很 (hěn) тут почти не значит «очень» — это просто «связка». Контраст: 这个大，那个小.' },
        words: [
          { hanzi: '大', pinyin: 'dà', ru: 'большой' },
          { hanzi: '小', pinyin: 'xiǎo', ru: 'маленький' },
          { hanzi: '热', pinyin: 'rè', ru: 'жаркий, горячий' },
          { hanzi: '冷', pinyin: 'lěng', ru: 'холодный' },
          { hanzi: '多', pinyin: 'duō', ru: 'много' },
          { hanzi: '少', pinyin: 'shǎo', ru: 'мало' },
          { hanzi: '好', pinyin: 'hǎo', ru: 'хороший, хорошо' },
          { hanzi: '漂亮', pinyin: 'piàoliang', ru: 'красивый' },
        ],
        sentences: [
          { hanzi: '今天很热。', pinyin: 'Jīntiān hěn rè.', ru: 'Сегодня жарко.' },
          { hanzi: '这个大，那个小。', pinyin: 'Zhège dà, nàge xiǎo.', ru: 'Это большое, а то маленькое.' },
          { hanzi: '她很漂亮。', pinyin: 'Tā hěn piàoliang.', ru: 'Она очень красивая.' },
        ],
      },
      {
        id: 'u10l2', title: 'Погода', emoji: '☔',
        intro: 'Какая погода и как спросить «ну как?».',
        grammar: { title: 'Слишком: 太…了',
          body: '太 (tài) + прилагательное + 了 = «слишком…»: 太冷了！— «слишком холодно!». 怎么样 (zěnmeyàng) — «как?, ну как?»: 天气怎么样？— «какая погода?».' },
        words: [
          { hanzi: '天气', pinyin: 'tiānqì', ru: 'погода' },
          { hanzi: '下雨', pinyin: 'xià yǔ', ru: 'идёт дождь' },
          { hanzi: '太', pinyin: 'tài', ru: 'слишком' },
          { hanzi: '怎么样', pinyin: 'zěnmeyàng', ru: 'как? (оценка)' },
          { hanzi: '一点儿', pinyin: 'yìdiǎnr', ru: 'немного, чуть-чуть' },
          { hanzi: '些', pinyin: 'xiē', ru: 'несколько, немного' },
          { hanzi: '哪', pinyin: 'nǎ', ru: 'какой, который' },
          { hanzi: '没有', pinyin: 'méiyǒu', ru: 'нет, не иметь' },
        ],
        sentences: [
          { hanzi: '今天天气怎么样？', pinyin: 'Jīntiān tiānqì zěnmeyàng?', ru: 'Какая сегодня погода?' },
          { hanzi: '今天下雨了。', pinyin: 'Jīntiān xià yǔ le.', ru: 'Сегодня пошёл дождь.' },
          { hanzi: '今天太冷了。', pinyin: 'Jīntiān tài lěng le.', ru: 'Сегодня слишком холодно.' },
        ],
      },
      {
        id: 'u10l3', title: 'Календарь и возраст', emoji: '📆',
        intro: 'Год, месяц, число и сколько тебе лет.',
        grammar: { title: 'Дата 几月几号 и возраст 多大 / 几岁',
          body: 'Дата: 几月几号？— «какой месяц и число?». Возраст: взрослого спрашивают 你多大？(nǐ duō dà), ребёнка — 你几岁？(jǐ suì). 岁 (suì) — «лет (возраста)».' },
        words: [
          { hanzi: '年', pinyin: 'nián', ru: 'год' },
          { hanzi: '月', pinyin: 'yuè', ru: 'месяц' },
          { hanzi: '号', pinyin: 'hào', ru: 'число (даты)' },
          { hanzi: '岁', pinyin: 'suì', ru: 'лет (возраст)' },
          { hanzi: '中午', pinyin: 'zhōngwǔ', ru: 'полдень' },
          { hanzi: '时候', pinyin: 'shíhou', ru: 'время, момент' },
          { hanzi: '分钟', pinyin: 'fēnzhōng', ru: 'минута' },
        ],
        sentences: [
          { hanzi: '今天几月几号？', pinyin: 'Jīntiān jǐ yuè jǐ hào?', ru: 'Какое сегодня число?' },
          { hanzi: '你今年多大？', pinyin: 'Nǐ jīnnián duō dà?', ru: 'Сколько тебе лет?' },
          { hanzi: '现在是中午。', pinyin: 'Xiànzài shì zhōngwǔ.', ru: 'Сейчас полдень.' },
        ],
      },
    ],
  },
];

/* Удобный «плоский» список всех слов — пригодится для поиска и квизов. */
CN.allWords = (function () {
  const out = [];
  CN.units.forEach(u => u.lessons.forEach(l =>
    l.words.forEach(w => out.push({ ...w, lessonId: l.id, unitId: u.id, lesson: l.title }))));
  return out;
})();
