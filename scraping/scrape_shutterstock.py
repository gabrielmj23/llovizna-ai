"""
Script para scrapear imágenes de Shutterstock
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
term = input(
    "Introduce el término de búsqueda (en minúsculas y separado por guiones): "
)
page = input("Introduce el número de página a scrapear: ")
driver.get(
    f"https://www.shutterstock.com/es/search/{term}?image_type=photo&page={page}"
)

# Esperar a que se cargue la página
driver.implicitly_wait(10)

# Abrir csv para guardar las URLs como respaldo
csv_file = open(
    f"imagenes_shutterstock_{term}.csv", mode="a", newline="", encoding="utf-8"
)
csv_writer = csv.writer(csv_file)

# Escribir encabezado solo si el archivo está vacío
if os.stat(csv_file.name).st_size == 0:
    csv_writer.writerow(["url"])

# Crear una carpeta con el nombre del término de búsqueda si no existe
folder_name = term
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

while True:
    # Encontrar todas las etiquetas <img> cuyo padre es <picture> y cuya clase termina en '-thumbnail'
    imgs = driver.find_elements(By.CSS_SELECTOR, "picture > img[class$='-thumbnail']")

    print(
        f"Se encontraron {len(imgs)} imágenes con clase '-thumbnail' dentro de <picture>."
    )
    for img in imgs:
        src = img.get_attribute("src")
        if src:
            csv_writer.writerow([src])  # Agregar al CSV
            try:
                # Descargar imagen
                response = requests.get(src, timeout=10)
                if response.status_code == 200:
                    filename = os.path.join(
                        folder_name, os.path.basename(src.split("?")[0])
                    )
                    with open(filename, "wb") as f:
                        f.write(response.content)
                    print(f"Imagen guardada: {filename}")
                else:
                    print(f"No se pudo descargar la imagen: {src}")
            except Exception as e:
                print(f"Error al descargar {src}: {e}")

    # Ver si se puede avanzar
    next_button = driver.find_element(
        By.CSS_SELECTOR, "a[aria-label='Página siguiente']"
    )
    # Scroll to the next button to ensure it's clickable
    driver.execute_script("arguments[0].scrollIntoView();", next_button)
    driver.implicitly_wait(5)
    if next_button.get_attribute("disabled") is not None:
        break

    next_button.click()
    driver.implicitly_wait(15)

# Cerrar el navegador y el archivo CSV
csv_file.close()
driver.quit()
print("Scraping completado y navegador cerrado.")
print(
    f"URLs guardadas en 'imagenes_shutterstock_{term}.csv' y las imágenes guardadas en la carpeta '{folder_name}'."
)
