import os
import time
from PIL import Image
from playwright.sync_api import sync_playwright

OUT_DIR = r"c:\Users\ygarrido\Documents\yeraygarrido.dev\public\img\projects"

def save_image(page, name_base):
    png_path = os.path.join(OUT_DIR, f"{name_base}.png")
    webp_path = os.path.join(OUT_DIR, f"{name_base}.webp")
    page.screenshot(path=png_path)
    im = Image.open(png_path).convert('RGB')
    im.save(webp_path, 'WEBP', quality=85)
    print(f"Saved {name_base}.webp ({os.path.getsize(webp_path)} bytes)")

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # 1. Bide+ Hub Home Desktop
        p_desk = browser.new_page(viewport={"width": 1280, "height": 800})
        p_desk.goto("https://bideplus.vercel.app")
        p_desk.wait_for_timeout(3500)
        save_image(p_desk, "bideplus_home_desktop")
        save_image(p_desk, "bideplus_desktop") # also update main desktop thumbnail

        # 2. Bide+ Hub Home Mobile
        p_mob = browser.new_page(viewport={"width": 375, "height": 812})
        p_mob.goto("https://bideplus.vercel.app")
        p_mob.wait_for_timeout(3500)
        save_image(p_mob, "bideplus_home_mobile")
        save_image(p_mob, "bideplus_mobile") # also update main mobile thumbnail

        # 3. Bizkaibus+ Mobile
        p_bus_m = browser.new_page(viewport={"width": 375, "height": 812})
        p_bus_m.goto("https://bideplus.vercel.app/?red=bus")
        p_bus_m.wait_for_timeout(3500)
        save_image(p_bus_m, "bideplus_bizkaibus_mobile")

        # 4. Bizkaibus+ Desktop
        p_bus_d = browser.new_page(viewport={"width": 1280, "height": 800})
        p_bus_d.goto("https://bideplus.vercel.app/?red=bus")
        p_bus_d.wait_for_timeout(3500)
        save_image(p_bus_d, "bideplus_bizkaibus_desktop")

        # 5. Metro+ Mobile
        p_metro_m = browser.new_page(viewport={"width": 375, "height": 812})
        p_metro_m.goto("https://bideplus.vercel.app/?red=metro")
        p_metro_m.wait_for_timeout(3500)
        save_image(p_metro_m, "bideplus_metro_mobile")

        # 6. Euskotren+ Mobile
        p_euskotren_m = browser.new_page(viewport={"width": 375, "height": 812})
        p_euskotren_m.goto("https://bideplus.vercel.app/?red=euskotren")
        p_euskotren_m.wait_for_timeout(3500)
        save_image(p_euskotren_m, "bideplus_euskotren_mobile")

        # 7. Renfe Cercanías+ Mobile
        p_renfe_m = browser.new_page(viewport={"width": 375, "height": 812})
        p_renfe_m.goto("https://bideplus.vercel.app/?red=renfe")
        p_renfe_m.wait_for_timeout(3500)
        save_image(p_renfe_m, "bideplus_renfe_mobile")

        browser.close()
        print("--- ALL BIDE+ CAPTURES COMPLETED ---")

if __name__ == "__main__":
    run()
