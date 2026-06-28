/* ============================================================
   core/mascot.js — питомец-компаньон 🐼.
   Маленькая панда в углу: радуется верным ответам, поддерживает
   при ошибке, здоровается на главной, реагирует на уровень.
   Секрет: 5 нажатий подряд → спрятанное сообщение от Дани.
   Уважает prefers-reduced-motion и настройку «показывать друга».
   ============================================================ */
window.CN = window.CN || {};
CN.mascot = (function () {
  const { el } = CN.u;
  const reduced = () => CN.fx && CN.fx.reduced && CN.fx.reduced();

  const PHRASES = {
    correct: ['太棒了！', '好厉害！', '对！', 'Умница!', '棒棒哒！', '就是这样！', 'Горжусь!'],
    wrong:   ['没关系！', 'Почти!', '别灰心 ❤', '再试一次~', 'Ты сможешь!', 'Бывает!'],
    greet:   ['你好，Женя！', 'Готова учить? 加油！', 'Я скучал ❤', '一起学习吧！', 'Привет, умница!'],
    tap:     ['我是你的小熊猫 🐼', '加油！', 'Ты молодец ❤', '嘻嘻~', 'Люблю тебя 🐼'],
    levelup: ['升级啦！🎉', 'Новый уровень!', '太厉害了！'],
  };
  // спрятанные записки от Дани (показываются по «секрету»)
  const SECRETS = [
    'Раз ты это нашла — знай: я горжусь тобой каждый день. Твой Даня ❤',
    'Маленький секрет: я сделал это, потому что очень тебя люблю 🐼❤',
    'Ты самая умная и красивая. Учи спокойно — я рядом ❤',
    '加油，моя хорошая! У нас впереди целая жизнь и целый Китай вдвоём ❤',
  ];

  let root, bubble, bubbleTimer, tapCount = 0, tapTimer, greeted = false, secretIdx = 0;

  function pandaSVG() {
    return `
      <svg class="pet-svg" viewBox="0 0 100 100" width="64" height="64" aria-hidden="true">
        <ellipse class="pet-ear" cx="26" cy="24" rx="13" ry="13"/>
        <ellipse class="pet-ear" cx="74" cy="24" rx="13" ry="13"/>
        <ellipse class="pet-face" cx="50" cy="54" rx="34" ry="31"/>
        <ellipse class="pet-patch" cx="36" cy="50" rx="9" ry="11" transform="rotate(-12 36 50)"/>
        <ellipse class="pet-patch" cx="64" cy="50" rx="9" ry="11" transform="rotate(12 64 50)"/>
        <circle class="pet-eye" cx="37" cy="51" r="3.6"/>
        <circle class="pet-eye" cx="63" cy="51" r="3.6"/>
        <circle class="pet-shine" cx="38.2" cy="49.6" r="1.1"/>
        <circle class="pet-shine" cx="64.2" cy="49.6" r="1.1"/>
        <ellipse class="pet-nose" cx="50" cy="63" rx="4" ry="2.7"/>
        <path class="pet-mouth" d="M50 66 q-6 7 -12 3 M50 66 q6 7 12 3"/>
      </svg>`;
  }

  function build() {
    if (CN.store.settings().pet === false) return;
    root = el('div', { class: 'pet', role: 'button', tabindex: '0', 'aria-label': 'Твой питомец — нажми, чтобы поговорить' });
    root.innerHTML = pandaSVG();
    bubble = el('div', { class: 'pet-bubble', hidden: true });
    root.append(bubble);
    document.body.append(root);

    root.addEventListener('click', onTap);
    root.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTap(); } });

    // моргание изредка
    setInterval(() => { if (!reduced() && document.hasFocus()) { root.classList.add('blink'); setTimeout(() => root.classList.remove('blink'), 200); } }, 4200);

    // реакции на события приложения
    document.addEventListener('cn:answer', (e) => react(e.detail.ok ? 'correct' : 'wrong'));
    document.addEventListener('cn:levelup', () => react('levelup'));
    document.addEventListener('cn:rendered', (e) => {
      if (!greeted && e.detail && e.detail.view === 'home') { greeted = true; setTimeout(() => say(pick('greet')), 700); }
    });
  }

  function pick(kind) { const a = PHRASES[kind]; return a[(Math.random() * a.length) | 0]; }

  function react(kind) {
    if (!root) return;
    root.classList.remove('happy', 'sad', 'cheer');
    void root.offsetWidth;                       // перезапуск анимации
    if (kind === 'correct') root.classList.add('happy');
    else if (kind === 'wrong') root.classList.add('sad');
    else if (kind === 'levelup') root.classList.add('cheer');
    say(pick(kind));
    setTimeout(() => root && root.classList.remove('happy', 'sad', 'cheer'), 900);
  }

  function say(text) {
    if (!bubble) return;
    bubble.textContent = text; bubble.hidden = false;
    bubble.classList.remove('show'); void bubble.offsetWidth; bubble.classList.add('show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => { bubble.classList.remove('show'); setTimeout(() => { if (bubble) bubble.hidden = true; }, 280); }, 3200);
  }

  function onTap() {
    tapCount++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { tapCount = 0; }, 1400);   // сбрасываем «комбо» тапов
    if (!reduced()) { root.classList.add('happy'); setTimeout(() => root && root.classList.remove('happy'), 700); }
    if (tapCount >= 5) { tapCount = 0; showSecret(); return; }
    say(pick('tap'));
  }

  function showSecret() {
    const text = SECRETS[secretIdx % SECRETS.length]; secretIdx++;
    const overlay = el('div', { class: 'modal-overlay', onclick: (e) => { if (e.target === overlay) overlay.remove(); } }, [
      el('div', { class: 'modal surprise' }, [
        el('div', { class: 'surprise-heart' }, '🐼'),
        el('div', { class: 'surprise-zi' }, '秘密'),
        el('p', { class: 'surprise-text' }, text),
        el('button', { class: 'btn btn-primary', onclick: () => overlay.remove() }, 'Спрятать обратно ❤'),
      ]),
    ]);
    document.body.append(overlay);
    if (CN.fx) CN.fx.petals({ count: 22 });
  }

  function refresh() {                            // вызвать после смены настройки
    const want = CN.store.settings().pet !== false;
    if (want && !root) build();
    else if (!want && root) { root.remove(); root = null; }
  }

  function init() { if (document.body) build(); else document.addEventListener('DOMContentLoaded', build); }
  return { init, refresh, say };
})();
