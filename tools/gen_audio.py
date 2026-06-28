# tools/gen_audio.py
# Генерирует MP3 живым нейро-голосом (edge-tts) для всех строк из audio/_gen_list.json.
# Уже существующие файлы пропускает (можно дозапускать после добавления слов).
# Запуск:  python tools/gen_audio.py
import asyncio
import json
import os
import sys

import edge_tts

try:  # чтобы китайские иероглифы корректно печатались в консоли Windows
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

VOICE = "zh-CN-XiaoxiaoNeural"   # тёплый женский голос
CONCURRENCY = 6                  # сколько файлов генерим параллельно

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
AUDIO = os.path.join(ROOT, "audio")


async def one(item, sem, done, total):
    text, file = item["text"], item["file"]
    out = os.path.join(AUDIO, file)
    if os.path.exists(out) and os.path.getsize(out) > 0:
        done[0] += 1
        return
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, VOICE).save(out)
                done[0] += 1
                print(f"[{done[0]}/{total}] {file}  {text}")
                return
            except Exception as e:
                if attempt == 2:
                    print(f"  ОШИБКА {file} ({text}): {e}", file=sys.stderr)
                else:
                    await asyncio.sleep(1.0)


async def main():
    with open(os.path.join(AUDIO, "_gen_list.json"), encoding="utf-8") as f:
        items = json.load(f)
    total = len(items)
    done = [0]
    sem = asyncio.Semaphore(CONCURRENCY)
    await asyncio.gather(*(one(it, sem, done, total) for it in items))
    print(f"Готово: {done[0]}/{total} файлов в audio/")


if __name__ == "__main__":
    asyncio.run(main())
