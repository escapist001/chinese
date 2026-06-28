/* ============================================================
   core/mascot.js — питомцы-компаньоны Люся 🐱 и Рада 🐶.
   Сидят в углу: радуются верным ответам, поддерживают при ошибке,
   здороваются на главной, реагируют на новый уровень.
   Слова поддержки — на русском.
   • Если в папке pets/ лежит картинка (pets/lusya.png и т.п.) —
     показываем её. Иначе — рисуем питомца векторно (SVG).
   • Секрет: 5 нажатий подряд по питомцу → тёплое сообщение.
   Выбор «кто рядом» — в Настройках (settings.petChar).
   Уважает prefers-reduced-motion.
   ============================================================ */
window.CN = window.CN || {};
CN.mascot = (function () {
  const { el } = CN.u;
  const reduced = () => CN.fx && CN.fx.reduced && CN.fx.reduced();

  const PETS = {
    lusya: {
      id: 'lusya', name: 'Люся', species: 'cat',
      img: 'pets/lusya.png', imgHappy: 'pets/lusya-happy.png', imgSad: 'pets/lusya-sad.png',
      phrases: {
        correct: ['Умница моя ❤', 'Мур-мур, верно!', 'Вот так, Женечка', 'Я горжусь тобой', 'Молодец!', 'Правильно, солнышко'],
        wrong:   ['Ничего страшного ❤', 'Попробуй ещё, я рядом', 'Не грусти, мур', 'Ты справишься', 'Бывает, котёнок'],
        greet:   ['Привет, Женечка ❤', 'Я с тобой, мур', 'Давай позанимаемся?', 'Я скучала по тебе', 'Я приглядываю за тобой ❤'],
        tap:     ['Мур-мур 🐾', 'Я люблю тебя ❤', 'Погладила? Спасибо', 'Я всегда рядом', 'Мяу!'],
        levelup: ['Новый уровень! Горжусь ❤', 'Вот это да, умница!', 'Ты лучшая!'],
      },
      secrets: [
        'Это Люся. Я никуда не делась — я в твоём сердце и всегда рядом ❤',
        'Учись спокойно, моя хорошая. Я приглядываю за тобой 🐾❤',
        'Ты самая добрая на свете. Спасибо, что любишь меня. Мур ❤',
        'Устала? Просто погладь меня вот так — и я приду. Я всегда с тобой ❤',
      ],
    },
    rada: {
      id: 'rada', name: 'Рада', species: 'dog',
      img: 'pets/rada.png', imgHappy: 'pets/rada-happy.png', imgSad: 'pets/rada-sad.png',
      phrases: {
        correct: ['Гав! Молодец!', 'Так держать!', 'Ты умница ❤', 'Вот это да!', 'Правильно!'],
        wrong:   ['Ничего, попробуй ещё!', 'Не сдавайся!', 'Я в тебя верю, гав', 'Ты сможешь!'],
        greet:   ['Привет, Женя! Гав-гав ❤', 'Готова? Я с тобой!', 'Поучимся вместе?', 'Рада тебя видеть!'],
        tap:     ['Гав! 🐾', 'Виляю хвостом ❤', 'Поиграем потом?', 'Ты лучшая!'],
        levelup: ['Уровень взят! Гав!', 'Вот это да!', 'Горжусь тобой ❤'],
      },
      secrets: [
        'Это Рада! Я всегда буду тебя охранять и поддерживать. Гав ❤',
        'Когда грустно — обними меня покрепче. Я рядом 🐾',
        'Ты для меня самая лучшая на свете. Гав-гав ❤',
      ],
    },
    panda: {
      id: 'panda', name: 'Панда', species: 'panda', img: null,
      phrases: {
        correct: ['Молодец!', '太棒了!', 'Умница ❤', 'Горжусь!'],
        wrong:   ['Ничего страшного!', 'Попробуй ещё', 'Ты сможешь ❤'],
        greet:   ['Привет, Женя!', 'Готова учить? 加油!', 'Я рядом ❤'],
        tap:     ['🐼 🐾', 'Я люблю тебя ❤', 'Привет!'],
        levelup: ['Новый уровень! 🎉', 'Ты лучшая!'],
      },
      secrets: ['Кто-то очень тебя любит и сделал это для тебя ❤'],
    },
  };

  // что показываем: 'off' | 'lusya' | 'rada' | 'both' | 'panda'
  function chosen() {
    const s = CN.store.settings();
    if (s.pet === false) return 'off';
    return s.petChar || 'both';            // по умолчанию — Люся и Рада вместе
  }
  function activePets() {
    switch (chosen()) {
      case 'off': return [];
      case 'lusya': return [PETS.lusya];
      case 'rada': return [PETS.rada];
      case 'panda': return [PETS.panda];
      case 'both':
      default: return [PETS.lusya, PETS.rada];
    }
  }

  let zone, insts = [], greeted = false, secretIdx = 0;

  /* ── SVG-питомцы (запасной вариант, если нет картинки) ── */
  // Люся — чёрно-белая кошка «в смокинге» (по реальным фото)
  function catSVG() {
    return `<svg class="pet-svg pet-cat" viewBox="0 0 100 100" aria-hidden="true">
      <path class="cat-white" d="M33 84 Q50 70 67 84 L67 100 L33 100 Z"/>
      <path class="cat-fur cat-ear" d="M21 44 L27 12 L47 36 Z"/><path class="cat-fur cat-ear" d="M79 44 L73 12 L53 36 Z"/>
      <path class="cat-ear-in" d="M28 40 L31 21 L42 35 Z"/><path class="cat-ear-in" d="M72 40 L69 21 L58 35 Z"/>
      <ellipse class="cat-fur" cx="50" cy="55" rx="33" ry="30"/>
      <ellipse class="cat-muzzle" cx="50" cy="64" rx="17" ry="14"/>
      <ellipse class="cat-white" cx="50" cy="72" rx="8.5" ry="5.5"/>
      <ellipse class="pet-eye cat-eye" cx="38" cy="53" rx="4" ry="5.4"/><ellipse class="pet-eye cat-eye" cx="62" cy="53" rx="4" ry="5.4"/>
      <ellipse class="cat-pupil" cx="38" cy="53" rx="1.5" ry="4.3"/><ellipse class="cat-pupil" cx="62" cy="53" rx="1.5" ry="4.3"/>
      <circle class="pet-shine" cx="39.5" cy="51" r="1.1"/><circle class="pet-shine" cx="63.5" cy="51" r="1.1"/>
      <path class="cat-nose" d="M46.5 60 L53.5 60 L50 64 Z"/>
      <path class="cat-mouth" d="M50 64 L50 67 M50 67 q-4 4 -8 2 M50 67 q4 4 8 2"/>
      <g class="cat-whisker"><line x1="17" y1="61" x2="34" y2="63"/><line x1="17" y1="67" x2="34" y2="67"/><line x1="83" y1="61" x2="66" y2="63"/><line x1="83" y1="67" x2="66" y2="67"/></g>
    </svg>`;
  }
  // Рада — кудрявая кремовая собачка-дудл (по реальным фото)
  function dogSVG() {
    return `<svg class="pet-svg pet-dog" viewBox="0 0 100 100" aria-hidden="true">
      <g class="dog-ear"><circle cx="20" cy="50" r="11"/><circle cx="15" cy="61" r="9.5"/><circle cx="22" cy="70" r="8"/>
        <circle cx="80" cy="50" r="11"/><circle cx="85" cy="61" r="9.5"/><circle cx="78" cy="70" r="8"/></g>
      <ellipse class="dog-fur" cx="50" cy="53" rx="31" ry="29"/>
      <g class="dog-fur"><circle cx="50" cy="16" r="8"/><circle cx="31" cy="29" r="10"/><circle cx="43" cy="21" r="10"/><circle cx="57" cy="21" r="10"/><circle cx="69" cy="29" r="10"/>
        <circle cx="23" cy="44" r="9"/><circle cx="77" cy="44" r="9"/><circle cx="24" cy="58" r="9"/><circle cx="76" cy="58" r="9"/>
        <circle cx="33" cy="70" r="9"/><circle cx="67" cy="70" r="9"/><circle cx="50" cy="75" r="9"/></g>
      <ellipse class="dog-muzzle" cx="50" cy="63" rx="15" ry="12"/>
      <circle class="pet-eye dog-eye" cx="39" cy="49" r="3.8"/><circle class="pet-eye dog-eye" cx="61" cy="49" r="3.8"/>
      <circle class="pet-shine" cx="40.3" cy="47.6" r="1.1"/><circle class="pet-shine" cx="62.3" cy="47.6" r="1.1"/>
      <ellipse class="dog-nose" cx="50" cy="59" rx="5.4" ry="3.9"/>
      <path class="dog-mouth" d="M50 63 q-6 6 -11 2 M50 63 q6 6 11 2"/>
      <path class="dog-tongue" d="M47 66 q3 6 6 0 Z"/>
    </svg>`;
  }
  function pandaSVG() {
    return `<svg class="pet-svg" viewBox="0 0 100 100" aria-hidden="true">
      <ellipse class="pet-ear" cx="26" cy="24" rx="13" ry="13"/><ellipse class="pet-ear" cx="74" cy="24" rx="13" ry="13"/>
      <ellipse class="pet-face" cx="50" cy="54" rx="34" ry="31"/>
      <ellipse class="pet-patch" cx="36" cy="50" rx="9" ry="11" transform="rotate(-12 36 50)"/>
      <ellipse class="pet-patch" cx="64" cy="50" rx="9" ry="11" transform="rotate(12 64 50)"/>
      <circle class="pet-eye" cx="37" cy="51" r="3.6"/><circle class="pet-eye" cx="63" cy="51" r="3.6"/>
      <circle class="pet-shine" cx="38.2" cy="49.6" r="1.1"/><circle class="pet-shine" cx="64.2" cy="49.6" r="1.1"/>
      <ellipse class="pet-nose" cx="50" cy="63" rx="4" ry="2.7"/>
      <path class="pet-mouth" d="M50 66 q-6 7 -12 3 M50 66 q6 7 12 3"/></svg>`;
  }
  function svgFor(pet) {
    const span = el('span', { class: 'pet-art pet-svg-wrap pet-' + pet.id });
    span.innerHTML = pet.species === 'cat' ? catSVG() : pet.species === 'dog' ? dogSVG() : pandaSVG();
    return span;
  }

  /* ── одно «существо» (картинка или SVG) ── */
  function makePet(pet) {
    const root = el('div', { class: 'pet pet-' + pet.id, role: 'button', tabindex: '0', 'aria-label': pet.name + ' — нажми, чтобы поговорить' });
    const bubble = el('div', { class: 'pet-bubble', hidden: true });
    const inst = { pet, root, bubble, art: null, img: null, hasHappy: false, hasSad: false, taps: 0, tapTimer: null, bTimer: null };

    // пробуем картинку; не загрузилась → SVG
    if (pet.img) {
      const img = el('img', { class: 'pet-art pet-img', alt: pet.name, src: pet.img });
      img.addEventListener('error', () => { const s = svgFor(pet); img.replaceWith(s); inst.art = s; inst.img = null; });
      inst.art = img; inst.img = img;
      preload(pet.imgHappy, () => inst.hasHappy = true);
      preload(pet.imgSad, () => inst.hasSad = true);
    } else {
      inst.art = svgFor(pet);
    }
    root.append(inst.art, bubble);

    root.addEventListener('click', () => onTap(inst));
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(inst); } });
    return inst;
  }
  function preload(src, ok) { if (!src) return; const im = new Image(); im.onload = ok; im.src = src; }

  function build() {
    if (zone) { zone.remove(); zone = null; } insts = [];
    const pets = activePets();
    if (!pets.length) return;
    zone = el('div', { class: 'pet-zone' });
    pets.forEach(p => { const inst = makePet(p); insts.push(inst); zone.append(inst.root); });
    document.body.append(zone);

    // моргание изредка (для SVG-глаз)
    setInterval(() => {
      if (reduced() || !document.hasFocus()) return;
      insts.forEach(i => { i.root.classList.add('blink'); setTimeout(() => i.root.classList.remove('blink'), 200); });
    }, 4600);

    document.addEventListener('cn:answer', (e) => reactAll(e.detail.ok ? 'correct' : 'wrong'));
    document.addEventListener('cn:levelup', () => reactAll('levelup'));
    document.addEventListener('cn:rendered', (e) => {
      if (!greeted && e.detail && e.detail.view === 'home') { greeted = true; setTimeout(() => { const i = insts[(Math.random() * insts.length) | 0]; if (i) say(i, pick(i.pet, 'greet')); }, 700); }
    });
  }

  function pick(pet, kind) { const a = pet.phrases[kind]; return a[(Math.random() * a.length) | 0]; }

  // анимируем всех, говорит — один (чтобы не было двух пузырей разом)
  function reactAll(kind) {
    if (!insts.length) return;
    insts.forEach(i => animate(i, kind));
    const speaker = insts[(Math.random() * insts.length) | 0];
    say(speaker, pick(speaker.pet, kind));
  }

  function animate(inst, kind) {
    const cls = kind === 'correct' ? 'happy' : kind === 'wrong' ? 'sad' : kind === 'levelup' ? 'cheer' : 'happy';
    inst.root.classList.remove('happy', 'sad', 'cheer'); void inst.root.offsetWidth;
    inst.root.classList.add(cls);
    // подмена выражения мордочки (если картинки есть)
    if (inst.img) {
      const v = kind === 'correct' && inst.hasHappy ? inst.pet.imgHappy : kind === 'wrong' && inst.hasSad ? inst.pet.imgSad : null;
      if (v) { const base = inst.pet.img; inst.img.src = v; setTimeout(() => { if (inst.img) inst.img.src = base; }, 1100); }
    }
    setTimeout(() => inst.root && inst.root.classList.remove('happy', 'sad', 'cheer'), 950);
  }

  function say(inst, text) {
    const b = inst.bubble;
    b.textContent = text; b.hidden = false;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(inst.bTimer);
    inst.bTimer = setTimeout(() => { b.classList.remove('show'); setTimeout(() => { b.hidden = true; }, 280); }, 3300);
  }

  function onTap(inst) {
    inst.taps++;
    clearTimeout(inst.tapTimer);
    inst.tapTimer = setTimeout(() => { inst.taps = 0; }, 1500);
    animate(inst, 'correct');
    if (inst.taps >= 5) { inst.taps = 0; showSecret(inst.pet); return; }
    say(inst, pick(inst.pet, 'tap'));
  }

  function showSecret(pet) {
    const arr = pet.secrets || ['Тебя очень любят ❤'];
    const text = arr[secretIdx % arr.length]; secretIdx++;
    const overlay = el('div', { class: 'modal-overlay', onclick: (e) => { if (e.target === overlay) overlay.remove(); } }, [
      el('div', { class: 'modal surprise' }, [
        el('div', { class: 'surprise-heart' }, pet.species === 'cat' ? '🐱' : pet.species === 'dog' ? '🐶' : '🐼'),
        el('div', { class: 'surprise-zi' }, pet.name),
        el('p', { class: 'surprise-text' }, text),
        el('button', { class: 'btn btn-primary', onclick: () => overlay.remove() }, 'Спасибо ❤'),
      ]),
    ]);
    document.body.append(overlay);
    if (CN.fx) CN.fx.petals({ count: 22 });
  }

  function refresh() { build(); }
  function init() { if (document.body) build(); else document.addEventListener('DOMContentLoaded', build); }
  return { init, refresh };
})();
