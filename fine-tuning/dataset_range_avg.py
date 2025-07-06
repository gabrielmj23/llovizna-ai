import os
from PIL import Image
import numpy as np

# Analiza todas las imágenes en train, val y test
base_dir = "../datasets"
subdirs = ["train", "val", "test"]

heights = []
widths = []

for subdir in subdirs:
    dir_path = os.path.join(base_dir, subdir)
    if not os.path.exists(dir_path):
        print(f"Carpeta no encontrada: {dir_path}")
        continue
    for root, dirs, files in os.walk(dir_path):
        for fname in files:
            if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                path = os.path.join(root, fname)
                try:
                    with Image.open(path) as img:
                        w, h = img.size
                        widths.append(w)
                        heights.append(h)
                except Exception as e:
                    print(f"Error con {path}: {e}")

heights = np.array(heights)
widths = np.array(widths)

print(f"Total de imágenes analizadas: {len(heights)}")
if len(heights) > 0:
    print(f"Alto - promedio: {heights.mean():.2f}, min: {heights.min()}, max: {heights.max()}")
    print(f"Ancho - promedio: {widths.mean():.2f}, min: {widths.min()}, max: {widths.max()}")
else:
    print("No se encontraron imágenes en las carpetas train, val o test.")