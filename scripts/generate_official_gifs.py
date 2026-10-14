import os
import io
from PIL import Image
from playwright.sync_api import sync_playwright

OUT_DIR = r"c:\Users\ygarrido\Documents\yeraygarrido.dev\public\img\projects"
BIDE_DIR = r"c:\Users\ygarrido\Documents\bide+\bideplus"
GAS_DIR = r"c:\Users\ygarrido\Documents\gasolinera-plus"

def save_gif(frames, out_path, frame_duration, bg_color):
    p_frames = []
    for f in frames:
        rgba = f.convert("RGBA")
        bg = Image.new("RGB", rgba.size, bg_color)
        bg.paste(rgba, mask=rgba.split()[3])
        # Quantize cleanly
        p_frames.append(bg.quantize(colors=256, method=Image.Resampling.LANCZOS))
    
    p_frames[0].save(
        out_path,
        save_all=True,
        append_images=p_frames[1:],
        duration=frame_duration,
        loop=0,
        optimize=True
    )
    print(f"Generated {os.path.basename(out_path)}: {len(p_frames)} frames, {os.path.getsize(out_path)} bytes")

def generate_bideplus_gif(browser):
    print("Generating BIDE+ animation from official source code...")
    svg_path = os.path.join(BIDE_DIR, "icons-bide-rojo", "bide-wordmark-mayusculas.svg")
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
    
    # Inject class="wordmark"
    svg_with_class = svg_content.replace("<svg ", '<svg class="wordmark" ')
    
    css_path = os.path.join(BIDE_DIR, "style-splash.css")
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()

    page = browser.new_page(viewport={"width": 640, "height": 450})
    html = f"""<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
body {{
    margin: 0;
    padding: 0;
    background: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
}}
{css_content}
.splash {{
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    opacity: 1;
    visibility: visible;
}}
.splash .wordmark {{
    height: 86px;
    width: auto;
}}
</style>
</head>
<body class="is-loading">
<div class="splash">
    {svg_with_class}
</div>
</body>
</html>"""

    page.set_content(html)
    page.wait_for_timeout(300)

    # Duration is 800ms according to @keyframes plus-spin
    total_ms = 800
    fps = 30
    num_frames = int(total_ms / 1000 * fps)
    frame_ms = total_ms // num_frames

    frames = []
    for i in range(num_frames):
        t = (i / num_frames) * total_ms
        page.evaluate(f"""() => {{
            const anims = document.getAnimations();
            for (const a of anims) {{
                a.pause();
                a.currentTime = {t};
            }}
        }}""")
        screenshot_bytes = page.screenshot()
        frames.append(Image.open(io.BytesIO(screenshot_bytes)))

    out_gif = os.path.join(OUT_DIR, "bideplus_loading.gif")
    save_gif(frames, out_gif, frame_ms, (255, 255, 255))
    page.close()

def generate_gasolinera_gif(browser):
    print("Generating Gasolinera+ animation from official source code...")
    page = browser.new_page(viewport={"width": 640, "height": 450})

    html = """<!doctype html>
<html class="is-loading">
<head>
<meta charset="utf-8">
<style>
:root {
    --bg: #0b0c0e;
    --text: #ffffff;
    --highlight: #FF7A1A;
    --font-display: 'Bricolage Grotesque', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
body {
    margin: 0;
    padding: 0;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
}
.splash {
    position: relative;
    inset: auto;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    opacity: 1;
    visibility: visible;
}
.splash__word {
    display: flex;
    align-items: center;
    font-family: var(--font-display);
    font-size: 3.4rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
}
.splash__plus {
    position: relative;
    display: inline-block;
    width: 0.72em;
    height: 0.72em;
    margin-left: 0.14em;
    font-size: 1.15em;
    color: transparent;
    overflow: hidden;
}
.splash__plus::before, .splash__plus::after {
    content: '';
    position: absolute;
    background: var(--highlight);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}
.splash__plus::before {
    width: 100%;
    height: 0.16em;
}
.splash__plus::after {
    width: 0.16em;
    height: 100%;
}
.is-loading .splash__plus {
    animation: splash-plus-spin 0.8s ease-in-out infinite;
}
@keyframes splash-plus-spin {
    0% { transform: rotate(0deg) scale(1); }
    60% { transform: rotate(360deg) scale(1.15); }
    100% { transform: rotate(360deg) scale(1); }
}
</style>
</head>
<body class="is-loading">
<div class="splash" aria-hidden="true">
    <span class="splash__word">GASOLINERA<span class="splash__plus">+</span></span>
</div>
</body>
</html>"""

    page.set_content(html)
    page.wait_for_timeout(300)

    total_ms = 800
    fps = 30
    num_frames = int(total_ms / 1000 * fps)
    frame_ms = total_ms // num_frames

    frames = []
    for i in range(num_frames):
        t = (i / num_frames) * total_ms
        page.evaluate(f"""() => {{
            const anims = document.getAnimations();
            for (const a of anims) {{
                a.pause();
                a.currentTime = {t};
            }}
        }}""")
        screenshot_bytes = page.screenshot()
        frames.append(Image.open(io.BytesIO(screenshot_bytes)))

    out_gif = os.path.join(OUT_DIR, "gasolinera_loading.gif")
    save_gif(frames, out_gif, frame_ms, (11, 12, 14))
    page.close()

def generate_pokemon_gif(browser):
    print("Generating Pokémon Card PSA Tracker animation from official source code...")
    page = browser.new_page(viewport={"width": 640, "height": 450})

    html = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
body {
    margin: 0;
    padding: 0;
    background: #151618;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.ballfx {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}
@keyframes ballspin {
    from { transform: rotate(0deg) scale(.55); }
    55% { transform: rotate(600deg) scale(1.12); }
    to { transform: rotate(1080deg) scale(1); }
}
.pball {
    width: 112px;
    height: 112px;
    border-radius: 50%;
    border: 5px solid #17181b;
    background: radial-gradient(circle at 50% 50%, #fff 0 13%, #17181b 13% 21%, transparent 22%),
                linear-gradient(180deg, #e53935 0 46%, #17181b 46% 54%, #f5f5f5 54%);
    box-shadow: 0 12px 34px rgba(0, 0, 0, .4);
    animation: ballspin 1s cubic-bezier(.55, 0, .25, 1) infinite;
}
.label {
    color: rgba(255, 255, 255, 0.45);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-weight: 700;
}
</style>
</head>
<body>
<div class="ballfx">
    <div class="pball"></div>
    <div class="label">Cargando Pokédex</div>
</div>
</body>
</html>"""

    page.set_content(html)
    page.wait_for_timeout(300)

    total_ms = 1000
    fps = 30
    num_frames = int(total_ms / 1000 * fps)
    frame_ms = total_ms // num_frames

    frames = []
    for i in range(num_frames):
        t = (i / num_frames) * total_ms
        page.evaluate(f"""() => {{
            const anims = document.getAnimations();
            for (const a of anims) {{
                a.pause();
                a.currentTime = {t};
            }}
        }}""")
        screenshot_bytes = page.screenshot()
        frames.append(Image.open(io.BytesIO(screenshot_bytes)))

    out_gif = os.path.join(OUT_DIR, "pokemon_pokeball_loading.gif")
    save_gif(frames, out_gif, frame_ms, (21, 22, 24))
    page.close()

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        generate_bideplus_gif(browser)
        generate_gasolinera_gif(browser)
        generate_pokemon_gif(browser)
        browser.close()
    print("ALL THREE OFFICIAL ANIMATION GIFS GENERATED PERFECTLY!")

if __name__ == "__main__":
    main()
