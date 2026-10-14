import os
import io
import time
import subprocess
from PIL import Image
from playwright.sync_api import sync_playwright

OUT_DIR = r"c:\Users\ygarrido\Documents\yeraygarrido.dev\public\img\projects"

def create_gif_from_frames(frames, output_path, duration=40):
    # Optimize palette and save
    converted_frames = [im.convert('RGBA') for im in frames]
    # Quantize to 128/256 colors for clean GIF
    p_frames = []
    for f in converted_frames:
        # Convert to RGB with white or background composite
        bg = Image.new('RGB', f.size, (255, 255, 255))
        bg.paste(f, mask=f.split()[3])
        p_frames.append(bg.quantize(colors=128, method=Image.Resampling.LANCZOS))
    
    p_frames[0].save(
        output_path,
        save_all=True,
        append_images=p_frames[1:],
        duration=duration,
        loop=0,
        optimize=True
    )
    print(f"Created GIF: {output_path} ({os.path.getsize(output_path)} bytes)")

def generate_pokemon_gif(browser):
    print("Generating Pokemon Pokéball loading GIF...")
    page = browser.new_page(viewport={"width": 640, "height": 450})
    
    html = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
@keyframes ballspin {
  0% { transform: rotate(0deg) scale(.55); }
  55% { transform: rotate(600deg) scale(1.12); }
  100% { transform: rotate(1080deg) scale(1); }
}
body {
  margin: 0;
  background: radial-gradient(circle at 50% 50%, #1e2229 0%, #111317 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  color: #fff;
  overflow: hidden;
}
.wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}
.pball {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 6px solid #17181b;
  background: radial-gradient(circle at 50% 50%, #fff 0 13%, #17181b 13% 21%, transparent 22%),
              linear-gradient(180deg, #e53935 0 46%, #17181b 46% 54%, #f5f5f5 54%);
  box-shadow: 0 16px 40px rgba(0, 0, 0, .55);
}
.title {
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
}
</style>
</head>
<body>
<div class="wrap">
  <div class="pball" id="ball"></div>
  <div class="title">Cargando Pokédex...</div>
</div>
</body>
</html>"""
    
    page.set_content(html)
    page.wait_for_timeout(300)
    
    # 30 frames over 1.0 second (33ms per frame)
    num_frames = 30
    total_duration_ms = 1000
    frame_ms = total_duration_ms // num_frames
    
    frames = []
    for i in range(num_frames):
        t = (i / num_frames) * 1.0
        # Compute keyframe math for ballspin:
        # 0% -> 55%: rotate 0 to 600, scale 0.55 to 1.12
        # 55% -> 100%: rotate 600 to 1080, scale 1.12 to 1.0
        p_val = i / num_frames
        if p_val <= 0.55:
            k = p_val / 0.55
            # ease-in-out
            eased = k * k * (3 - 2 * k)
            rot = eased * 600
            scale = 0.55 + eased * (1.12 - 0.55)
        else:
            k = (p_val - 0.55) / 0.45
            eased = k * k * (3 - 2 * k)
            rot = 600 + eased * (1080 - 600)
            scale = 1.12 - eased * (1.12 - 1.0)
            
        page.evaluate(f"""() => {{
            const b = document.getElementById('ball');
            b.style.transform = 'rotate({rot}deg) scale({scale})';
        }}""")
        
        screenshot_bytes = page.screenshot()
        frames.append(Image.open(io.BytesIO(screenshot_bytes)))
        
    out_gif = os.path.join(OUT_DIR, "pokemon_pokeball_loading.gif")
    create_gif_from_frames(frames, out_gif, duration=frame_ms)
    page.close()

def generate_bideplus_gif(browser):
    print("Generating Bide+ loading GIF...")
    page = browser.new_page(viewport={"width": 640, "height": 450})
    
    html = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
body {
  margin: 0;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}
.wordmark {
  display: flex;
  align-items: baseline;
  font-size: 72px;
  font-weight: 900;
  color: #17181c;
  letter-spacing: -0.03em;
}
.plus {
  color: #d6232b;
  font-size: 82px;
  display: inline-block;
  margin-left: 4px;
  transform-origin: center;
}
</style>
</head>
<body>
<div class="wordmark">
  <span>bide</span><span class="plus" id="p">+</span>
</div>
</body>
</html>"""
    
    page.set_content(html)
    page.wait_for_timeout(300)
    
    num_frames = 24
    total_duration_ms = 800
    frame_ms = total_duration_ms // num_frames
    
    frames = []
    for i in range(num_frames):
        p_val = i / num_frames
        # plus-spin:
        # 0% { transform: rotate(0deg) scale(1); }
        # 60% { transform: rotate(360deg) scale(1.15); }
        # 100% { transform: rotate(360deg) scale(1); }
        if p_val <= 0.6:
            k = p_val / 0.6
            eased = k * k * (3 - 2 * k)
            rot = eased * 360
            scale = 1.0 + eased * 0.15
        else:
            k = (p_val - 0.6) / 0.4
            eased = k * k * (3 - 2 * k)
            rot = 360
            scale = 1.15 - eased * 0.15
            
        page.evaluate(f"""() => {{
            const p = document.getElementById('p');
            p.style.transform = 'rotate({rot}deg) scale({scale})';
        }}""")
        
        screenshot_bytes = page.screenshot()
        frames.append(Image.open(io.BytesIO(screenshot_bytes)))
        
    out_gif = os.path.join(OUT_DIR, "bideplus_loading.gif")
    create_gif_from_frames(frames, out_gif, duration=frame_ms)
    page.close()

def generate_gasolinera_gif(browser):
    print("Generating Gasolinera+ loading GIF...")
    page = browser.new_page(viewport={"width": 640, "height": 450})
    
    html = """<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
body {
  margin: 0;
  background: #0f1013;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
}
.wordmark {
  display: flex;
  align-items: baseline;
  font-size: 58px;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}
.plus {
  color: #3b82f6;
  font-size: 68px;
  display: inline-block;
  margin-left: 6px;
  transform-origin: center;
}
</style>
</head>
<body>
<div class="wordmark">
  <span>Gasolinera</span><span class="plus" id="p">+</span>
</div>
</body>
</html>"""
    
    page.set_content(html)
    page.wait_for_timeout(300)
    
    num_frames = 24
    total_duration_ms = 800
    frame_ms = total_duration_ms // num_frames
    
    frames = []
    for i in range(num_frames):
        p_val = i / num_frames
        if p_val <= 0.6:
            k = p_val / 0.6
            eased = k * k * (3 - 2 * k)
            rot = eased * 360
            scale = 1.0 + eased * 0.18
        else:
            k = (p_val - 0.6) / 0.4
            eased = k * k * (3 - 2 * k)
            rot = 360
            scale = 1.18 - eased * 0.18
            
        page.evaluate(f"""() => {{
            const p = document.getElementById('p');
            p.style.transform = 'rotate({rot}deg) scale({scale})';
        }}""")
        
        screenshot_bytes = page.screenshot()
        frames.append(Image.open(io.BytesIO(screenshot_bytes)))
        
    out_gif = os.path.join(OUT_DIR, "gasolinera_loading.gif")
    create_gif_from_frames(frames, out_gif, duration=frame_ms)
    page.close()

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        generate_pokemon_gif(browser)
        generate_bideplus_gif(browser)
        generate_gasolinera_gif(browser)
        browser.close()
    print("ALL 3 GIFS GENERATED SUCCESSFULLY!")

if __name__ == "__main__":
    main()

