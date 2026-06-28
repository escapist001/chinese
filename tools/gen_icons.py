# tools/gen_icons.py — генерирует иконки приложения (PWA + apple-touch).
# Красный скруглённый квадрат с белым 中. Запуск: python tools/gen_icons.py
import os
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "icons")
os.makedirs(OUT, exist_ok=True)

RED = (210, 60, 44, 255)
WHITE = (255, 255, 255, 255)

# ищем системный CJK-шрифт
FONTS = [
    r"C:\Windows\Fonts\msyhbd.ttc", r"C:\Windows\Fonts\msyh.ttc",
    r"C:\Windows\Fonts\simhei.ttf", r"C:\Windows\Fonts\msjh.ttc",
]
font_path = next((f for f in FONTS if os.path.exists(f)), None)


def make(size, maskable=False):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    pad = 0 if maskable else int(size * 0.06)
    r = int(size * 0.22)
    d.rounded_rectangle([pad, pad, size - pad, size - pad], radius=r, fill=RED)
    if font_path:
        fs = int(size * (0.52 if maskable else 0.6))
        font = ImageFont.truetype(font_path, fs)
        ch = "中"
        bb = d.textbbox((0, 0), ch, font=font)
        w, h = bb[2] - bb[0], bb[3] - bb[1]
        d.text(((size - w) / 2 - bb[0], (size - h) / 2 - bb[1]), ch, font=font, fill=WHITE)
    return img


for s in (192, 512):
    make(s).save(os.path.join(OUT, f"icon-{s}.png"))
make(512, maskable=True).save(os.path.join(OUT, "icon-maskable.png"))
make(180).save(os.path.join(OUT, "apple-touch-icon.png"))
print("Иконки сохранены в icons/ (шрифт: %s)" % (font_path or "НЕ НАЙДЕН — без иероглифа"))
