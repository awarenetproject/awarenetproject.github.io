import os
from PIL import Image

def convert_to_webp(source, dest, quality=80, lossless=False):
    try:
        print(f"Converting {source} to {dest}...")
        with Image.open(source) as img:
            img.save(dest, "WEBP", quality=quality, lossless=lossless)
        original_size = os.path.getsize(source)
        new_size = os.path.getsize(dest)
        print(f"Success! {source} ({original_size/1024/1024:.2f}MB) -> {dest} ({new_size/1024/1024:.2f}MB)")
        return True
    except Exception as e:
        print(f"Failed to convert {source}: {e}")
        return False

def convert_gif_to_webp(source, dest):
    try:
        print(f"Converting GIF {source} to Animated WebP {dest}...")
        with Image.open(source) as img:
            # Check frames
            print(f"GIF has {img.n_frames} frames.")
            if img.n_frames > 200:
                print("Warning: Large number of frames. This might be slow.")
            
            img.save(dest, "WEBP", save_all=True, optimize=True, quality=80, loop=0)
            
        original_size = os.path.getsize(source)
        new_size = os.path.getsize(dest)
        print(f"Success! {source} ({original_size/1024/1024:.2f}MB) -> {dest} ({new_size/1024/1024:.2f}MB)")
        return True
    except Exception as e:
        print(f"Failed to convert GIF {source}: {e}")
        return False

# 1. Optimize brainHuman.png
convert_to_webp(
    "assets/images/research/brainHuman.png", 
    "assets/images/research/brainHuman.webp",
    quality=85,
    lossless=False 
)

# 2. Optimize brain_gif3.gif
# Note: Animated WebP is supported in most modern browsers.
convert_gif_to_webp(
    "assets/images/home/brain_gif3.gif", 
    "assets/images/home/brain_gif3.webp"
)
