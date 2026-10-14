import os
import io
from PIL import Image
from playwright.sync_api import sync_playwright

OUT_DIR = r"c:\Users\ygarrido\Documents\yeraygarrido.dev\public\img\projects"

UPLOADED = {
    "gasolinera_desktop": r"C:/Users/ygarrido/.gemini/antigravity/brain/40b9e8e3-3264-4ef8-915f-553aa1ecae2e/.user_uploaded/media_1791968787411_e9f0d5bf.png",
    "gasolinera_coche_desktop": r"C:/Users/ygarrido/.gemini/antigravity/brain/40b9e8e3-3264-4ef8-915f-553aa1ecae2e/.user_uploaded/media_1791968801269_cca3dbfc.png",
    "gasolinera_mobile": r"C:/Users/ygarrido/.gemini/antigravity/brain/40b9e8e3-3264-4ef8-915f-553aa1ecae2e/.user_uploaded/media_1791968814335_9cae6e8e.png",
    "gasolinera_viaje_mobile": r"C:/Users/ygarrido/.gemini/antigravity/brain/40b9e8e3-3264-4ef8-915f-553aa1ecae2e/.user_uploaded/media_1791968825839_580411bd.png"
}

def process_screenshots():
    for name, src_path in UPLOADED.items():
        im = Image.open(src_path).convert('RGB')
        webp_dest = os.path.join(OUT_DIR, f"{name}.webp")
        png_dest = os.path.join(OUT_DIR, f"{name}.png")
        im.save(webp_dest, "WEBP", quality=90, method=6)
        im.save(png_dest, "PNG", optimize=True)
        print(f"Processed {name}: {im.size} -> {webp_dest} ({os.path.getsize(webp_dest)} bytes)")

def create_gif_from_frames(frames, output_path, duration=40):
    converted_frames = [im.convert('RGBA') for im in frames]
    p_frames = []
    for f in converted_frames:
        bg = Image.new('RGB', f.size, (15, 16, 19))
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

def generate_orange_gasolinera_gif():
    print("Generating updated Orange Gasolinera+ loading GIF...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
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
  align-items: center;
  gap: 14px;
}
.flame {
  width: 54px;
  height: 54px;
  background: #FF7A1A;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(255, 122, 26, 0.35);
}
.flame svg {
  width: 32px;
  height: 32px;
  fill: #111111;
}
.title-wrap {
  display: flex;
  align-items: baseline;
  font-size: 56px;
  font-weight: 900;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}
.plus {
  color: #FF7A1A;
  font-size: 64px;
  display: inline-block;
  margin-left: 6px;
  transform-origin: center;
}
</style>
</head>
<body>
<div class="wordmark">
  <div class="flame">
    <svg viewBox="0 0 24 24"><path d="M12 2C9.5 6 6 8.5 6 13a6 6 0 0 0 12 0c0-2-1-4-2-5-0.5 2-2 3-3 3 0-2 1-5-1-9z"/></svg>
  </div>
  <div class="title-wrap">
    <span>GASOLINERA</span><span class="plus" id="p">+</span>
  </div>
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
        browser.close()

if __name__ == "__main__":
    process_screenshots()
    generate_orange_gasolinera_gif()
    print("ALL GASOLINERA+ ASSETS UPDATED SUCCESSFULLY!")

