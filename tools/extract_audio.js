/* tools/extract_audio.js
   Собирает все строки, которые нужно озвучить (слова, примеры, тоны),
   и формирует:
     - audio/_gen_list.json  — список {text,file} для генератора Python
     - audio/manifest.js     — карта text→file для самого сайта (без fetch, file:// дружелюбно)
   Запуск:  node tools/extract_audio.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'js', 'data');
const AUDIO = path.join(ROOT, 'audio');

// эмулируем браузерное окружение: window === global, бара CN станет глобальной
global.window = global;
eval(fs.readFileSync(path.join(DATA, 'pinyin.js'), 'utf8'));
eval(fs.readFileSync(path.join(DATA, 'lessons.js'), 'utf8'));
eval(fs.readFileSync(path.join(DATA, 'drills.js'), 'utf8'));
eval(fs.readFileSync(path.join(DATA, 'reference.js'), 'utf8'));
const CNX = global.CN;

const map = new Map(); // text -> file
let i = 0;
function add(text) {
  if (!text) return;
  text = String(text).trim();
  if (!text || map.has(text)) return;
  i++;
  map.set(text, 'w' + String(i).padStart(4, '0') + '.mp3');
}

// слова
CNX.allWords.forEach(w => add(w.hanzi));
// примеры (так же, как их озвучивает сайт: тире → пробел)
CNX.units.forEach(u => u.lessons.forEach(l =>
  (l.sentences || []).forEach(s => add(s.hanzi.replace(/[—\-]/g, ' ')))));
// тоны (妈 麻 马 骂 吗)
CNX.tones.forEach(t => add(t.hanzi));
// минимальные пары и тон-сандхи
(CNX.minimalPairs || []).forEach(g => g.options.forEach(o => add(o.hanzi)));
(CNX.toneSandhi || []).forEach(r => r.examples.forEach(e => add(e.hanzi)));
// диалоги для аудирования
(CNX.listening || []).forEach(d => d.lines.forEach(l => add(l.hanzi)));
// радикалы (ключ + примеры) и счётные слова (ключ + пример)
(CNX.radicals || []).forEach(r => { add(r.char); (r.examples || []).forEach(add); });
(CNX.measureWords || []).forEach(m => { add(m.char); if (m.example) add(m.example.hanzi); });
// проверочная фраза из настроек
add('你好世界');

if (!fs.existsSync(AUDIO)) fs.mkdirSync(AUDIO, { recursive: true });

const list = [...map.entries()].map(([text, file]) => ({ text, file }));
fs.writeFileSync(path.join(AUDIO, '_gen_list.json'), JSON.stringify(list, null, 0), 'utf8');

const obj = {};
for (const [text, file] of map) obj[text] = file;
const js = '/* Автогенерация (tools/extract_audio.js). Карта текст→аудиофайл. */\n'
  + 'window.CN = window.CN || {};\nCN.audioManifest = ' + JSON.stringify(obj) + ';\n';
fs.writeFileSync(path.join(AUDIO, 'manifest.js'), js, 'utf8');

console.log('Строк к озвучке: ' + list.length);
console.log('Записано: audio/_gen_list.json и audio/manifest.js');
