"""
Script para scrapear imágenes de INaturalist usando requests
"""

import os
import requests

# Solicitar el término de búsqueda
folder_name = input("Introduce el nombre de la carpeta para guardar las imágenes: ")
term = input("Introduce el id de taxón de INaturalist: ")
url = f"https://api.inaturalist.org/v1/observations?taxon_id={term}&order_by=votes&quality_grade=research&photos=true&page=1&per_page=100"
response = requests.get(url)
data = response.json()

counter = 1
for observation in data.get("results", []):
    photos = observation.get("photos", [])
    for photo in photos:
        url = photo.get("url", "")
        if url:
            url = url.replace("square.jpg", "medium.jpg")
            url = url.replace("square.jpeg", "medium.jpeg")
            ext = os.path.splitext(url)[1]
            # Nombre único: obsID_photoIndex.ext
            filename = f"{counter}{ext}"
            os.makedirs(folder_name, exist_ok=True)
            filepath = os.path.join(folder_name, filename)

            img_response = requests.get(url)
            if img_response.status_code == 200:
                with open(filepath, "wb") as f:
                    f.write(img_response.content)
                print(f"Descargada: {filepath}")
            else:
                print(f"Error al descargar {url}: {img_response.status_code}")
            counter += 1
