import os
import time
import subprocess
from PIL import Image
from playwright.sync_api import sync_playwright

OUT_DIR = r"c:\Users\ygarrido\Documents\yeraygarrido.dev\public\img\projects"
GASOLINERA_DIR = r"C:\Users\ygarrido\Documents\gasolinera-plus"
PHP_EXE = r"C:\php\php.exe"

def save_image(page, name_base):
    png_path = os.path.join(OUT_DIR, f"{name_base}.png")
    webp_path = os.path.join(OUT_DIR, f"{name_base}.webp")
    page.screenshot(path=png_path)
    im = Image.open(png_path).convert('RGB')
    im.save(webp_path, 'WEBP', quality=85)
    print(f"Saved {name_base}.png and {name_base}.webp ({os.path.getsize(webp_path)} bytes)")

def run():
    print("--- 1. CAPTURING GASOLINERA+ FROM LOCAL PAGE ---")
    php_proc = subprocess.Popen([PHP_EXE, "-S", "127.0.0.1:8012", "dev-router.php"], cwd=GASOLINERA_DIR)
    time.sleep(2)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch()

            # Gasolinera Desktop
            p_gas_desk = browser.new_page(viewport={"width": 1280, "height": 800})
            p_gas_desk.goto("http://127.0.0.1:8012")
            p_gas_desk.wait_for_timeout(3500)
            # Remove any top splash if present
            p_gas_desk.evaluate("() => { const s = document.getElementById('splash'); if (s) s.remove(); document.documentElement.classList.remove('is-loading'); }")
            p_gas_desk.wait_for_timeout(500)
            save_image(p_gas_desk, "gasolinera_desktop")

            # Gasolinera Mapa View
            # Check map toggle button
            p_gas_desk.evaluate("() => { const b = document.getElementById('map-toggle'); if (b) b.click(); }")
            p_gas_desk.wait_for_timeout(1500)
            save_image(p_gas_desk, "gasolinera_mapa")

            # Gasolinera Mobile
            p_gas_mob = browser.new_page(viewport={"width": 375, "height": 812})
            p_gas_mob.goto("http://127.0.0.1:8012")
            p_gas_mob.wait_for_timeout(3500)
            p_gas_mob.evaluate("() => { const s = document.getElementById('splash'); if (s) s.remove(); document.documentElement.classList.remove('is-loading'); }")
            p_gas_mob.wait_for_timeout(500)
            save_image(p_gas_mob, "gasolinera_mobile")

            print("--- 2. CAPTURING POKEMON CARD PSA TRACKER (DARK THEME, ADMIN MENU, FULLSCREEN SLAB) ---")
            
            # A) Card PSA Tracker - Dark Theme Desktop
            p_psa_dark = browser.new_page(viewport={"width": 1280, "height": 800})
            p_psa_dark.goto("https://garridoparrayeray.github.io/card_psa_tracker/")
            p_psa_dark.wait_for_timeout(2000)
            p_psa_dark.evaluate("() => { if (typeof setTheme === 'function') setTheme('dark'); else if (typeof applyTheme === 'function') applyTheme('dark'); }")
            p_psa_dark.wait_for_timeout(1000)
            save_image(p_psa_dark, "psa_dark_desktop")

            # B) Card PSA Tracker - Dark Theme Mobile
            p_psa_dark_mob = browser.new_page(viewport={"width": 375, "height": 812})
            p_psa_dark_mob.goto("https://garridoparrayeray.github.io/card_psa_tracker/")
            p_psa_dark_mob.wait_for_timeout(2000)
            p_psa_dark_mob.evaluate("() => { if (typeof setTheme === 'function') setTheme('dark'); else if (typeof applyTheme === 'function') applyTheme('dark'); }")
            p_psa_dark_mob.wait_for_timeout(1000)
            save_image(p_psa_dark_mob, "psa_dark_mobile")

            # C) Admin Menu - Desktop & Mobile
            p_admin_desk = browser.new_page(viewport={"width": 1280, "height": 800})
            p_admin_desk.goto("https://garridoparrayeray.github.io/card_psa_tracker/admin.html")
            p_admin_desk.wait_for_timeout(2000)
            # Open admin menu
            p_admin_desk.evaluate("() => { state.admMenu = true; render(false); }")
            p_admin_desk.wait_for_timeout(1000)
            save_image(p_admin_desk, "psa_admin_menu_desktop")

            p_admin_mob = browser.new_page(viewport={"width": 375, "height": 812})
            p_admin_mob.goto("https://garridoparrayeray.github.io/card_psa_tracker/admin.html")
            p_admin_mob.wait_for_timeout(2000)
            p_admin_mob.evaluate("() => { state.admMenu = true; render(false); }")
            p_admin_mob.wait_for_timeout(1000)
            save_image(p_admin_mob, "psa_admin_menu_mobile")

            # D) Admin in Dark Theme
            p_admin_dark = browser.new_page(viewport={"width": 1280, "height": 800})
            p_admin_dark.goto("https://garridoparrayeray.github.io/card_psa_tracker/admin.html")
            p_admin_dark.wait_for_timeout(2000)
            p_admin_dark.evaluate("() => { state.admMenu = false; if (typeof setTheme === 'function') setTheme('dark'); render(false); }")
            p_admin_dark.wait_for_timeout(1000)
            save_image(p_admin_dark, "psa_admin_dark_desktop")

            # E) Fullscreen Card Slab View (Ver la carta en pantalla completa)
            # Both on Desktop and Mobile
            p_slab_desk = browser.new_page(viewport={"width": 1280, "height": 800})
            p_slab_desk.goto("https://garridoparrayeray.github.io/card_psa_tracker/admin.html")
            p_slab_desk.wait_for_timeout(2000)
            # Open Charizard in full screen viewer
            p_slab_desk.evaluate('''() => {
                var c = cards.find(x => x.id === 'chz') || cards[0];
                state.card = c.id;
                var el = document.getElementById('main');
                el.innerHTML = viewerHtml();
                document.body.classList.add('lock');
            }''')
            p_slab_desk.wait_for_timeout(1500)
            save_image(p_slab_desk, "psa_card_fullscreen_desktop")

            p_slab_mob = browser.new_page(viewport={"width": 375, "height": 812})
            p_slab_mob.goto("https://garridoparrayeray.github.io/card_psa_tracker/admin.html")
            p_slab_mob.wait_for_timeout(2000)
            p_slab_mob.evaluate('''() => {
                var c = cards.find(x => x.id === 'chz') || cards[0];
                state.card = c.id;
                var el = document.getElementById('main');
                el.innerHTML = viewerHtml();
                document.body.classList.add('lock');
            }''')
            p_slab_mob.wait_for_timeout(1500)
            save_image(p_slab_mob, "psa_card_fullscreen_mobile")

            # Also capture card in Dark Theme fullscreen
            p_slab_dark = browser.new_page(viewport={"width": 1280, "height": 800})
            p_slab_dark.goto("https://garridoparrayeray.github.io/card_psa_tracker/admin.html")
            p_slab_dark.wait_for_timeout(2000)
            p_slab_dark.evaluate('''() => {
                setTheme('dark');
                var c = cards.find(x => x.id === 'chz') || cards[0];
                state.card = c.id;
                var el = document.getElementById('main');
                el.innerHTML = viewerHtml();
                document.body.classList.add('lock');
            }''')
            p_slab_dark.wait_for_timeout(1500)
            save_image(p_slab_dark, "psa_card_fullscreen_dark")

            browser.close()
            print("--- ALL CAPTURES COMPLETED SUCCESSFULLY ---")
    finally:
        php_proc.terminate()
        print("PHP server terminated.")

if __name__ == "__main__":
    run()
