import splitfolders
import os

# Define la ruta de tu dataset original
input_folder = "../datasets"

# Define la ruta donde se crearán las nuevas carpetas (train, val, test)
output_folder = "../datasets"

# Porcentajes para la división: (train, validation, test)
# Por ejemplo, 80% train, 10% validation, 10% test
split_ratios = (0.8, 0.1, 0.1)

# Asegúrate de que la carpeta de entrada exista
if not os.path.exists(input_folder):
    print(f"Error: La carpeta de entrada '{input_folder}' no existe.")
else:
    print(f"Dividiendo imágenes de '{input_folder}'...")
    splitfolders.ratio(
        input_folder,
        output=output_folder,
        seed=42,  # Para reproducibilidad, usa cualquier número entero
        ratio=split_ratios,
        group_prefix=None,  # Deja esto en None para la mayoría de los casos
    )
    print(f"¡División completada! Las carpetas se encuentran en '{output_folder}'.")
