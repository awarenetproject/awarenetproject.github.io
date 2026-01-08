
import os
from PIL import Image

def generate_favicon():
    source_path = "/Users/emmatosato/Documents/PhD/PhD Local Projects/awarenet_web/assets/images/research/brainHuman.png"
    dest_path = "/Users/emmatosato/Documents/PhD/PhD Local Projects/awarenet_web/assets/images/favicon.png"
    
    try:
        if not os.path.exists(source_path):
            print(f"Error: Source file not found: {source_path}")
            return
            
        img = Image.open(source_path)
        print(f"Original size: {img.size}")
        
        # Calculate crop box for center square
        width, height = img.size
        new_dim = min(width, height)
        
        left = (width - new_dim) / 2
        top = (height - new_dim) / 2
        right = (width + new_dim) / 2
        bottom = (height + new_dim) / 2
        
        img_cropped = img.crop((left, top, right, bottom))
        
        # Resize to 32x32
        img_resized = img_cropped.resize((32, 32), Image.Resampling.LANCZOS)
        
        img_resized.save(dest_path, "PNG")
        print(f"Favicon saved to: {dest_path}")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    generate_favicon()
