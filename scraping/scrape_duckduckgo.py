"""
Script para scrapear imágenes de DuckDuckGo
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
import csv
import os
import requests

# Iniciar el navegador
driver = webdriver.Firefox()  # Para basados de Firefox
# driver = webdriver.Chrome()  # Para trollers de Chrome
print("Navegador inicializado")

# Solicitar el término de búsqueda
term = input("Introduce el término de búsqueda (en minúsculas y separado por +): ")
driver.get(
    f"https://duckduckgo.com/?t=ffab&q={term}&ia=images&iax=images&iaf=type%3Aphoto"
)

# Esperar a que se cargue la página
driver.implicitly_wait(10)

# Abrir csv para guardar las URLs como respaldo
csv_file = open(
    f"imagenes_duckduckgo_{term}.csv", mode="a", newline="", encoding="utf-8"
)
csv_writer = csv.writer(csv_file)

# Escribir encabezado solo si el archivo está vacío
if os.stat(csv_file.name).st_size == 0:
    csv_writer.writerow(["url"])

# Crear una carpeta con el nombre del término de búsqueda si no existe
folder_name = term.replace("+", "-")
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

found = 0
while found < 100:
    imgs = driver.find_elements(By.CSS_SELECTOR, "#web_content_wrapper img")

    print(f"Se encontraron {len(imgs)} imágenes.")
    for img in imgs:
        src = img.get_attribute("src")
        if src:
            csv_writer.writerow([src])  # Agregar al CSV
            try:
                # Descargar imagen
                response = requests.get(src, timeout=10)
                if response.status_code == 200:
                    filename = os.path.join(folder_name, f"{term}_{found + 1}.jpg")
                    with open(filename, "wb") as f:
                        f.write(response.content)
                    print(f"Imagen guardada: {filename}")
                    found += 1
                    if found >= 150:
                        print(
                            "Se han encontrado 150 imágenes, finalizando el scraping."
                        )
                        break
                else:
                    print(f"No se pudo descargar la imagen: {src}")
            except Exception as e:
                print(f"Error al descargar {src}: {e}")

# Cerrar el navegador y el archivo CSV
csv_file.close()
driver.quit()
print("Scraping completado y navegador cerrado.")
print(
    f"URLs guardadas en 'imagenes_duckduckgo_{term}.csv' y las imágenes guardadas en la carpeta '{folder_name}'."
)
