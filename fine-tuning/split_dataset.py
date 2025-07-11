import splitfolders
import os
import sys

# Recibe la ruta del dataset original desde la terminal
if len(sys.argv) < 2:
    print("Uso: python split_dataset.py <ruta_del_dataset>")
    sys.exit(1)

input_folder = sys.argv[1]
output_folder = input_folder  # El output será igual al input


def rename_files_and_dirs(root_dir):
    # Renombra archivos y carpetas con "+" o espacios en el nombre
    for root, dirs, files in os.walk(root_dir, topdown=False):
        # Archivos
        for fname in files:
            if "+" in fname or " " in fname:
                new_fname = fname.replace("+", "_").replace(" ", "_")
                old_path = os.path.join(root, fname)
                new_path = os.path.join(root, new_fname)
                print(f"Renombrando archivo: {old_path} -> {new_path}")
                os.rename(old_path, new_path)
        # Carpetas
        for dname in dirs:
            if "+" in dname or " " in dname:
                new_dname = dname.replace("+", "_").replace(" ", "_")
                old_dir = os.path.join(root, dname)
                new_dir = os.path.join(root, new_dname)
                print(f"Renombrando carpeta: {old_dir} -> {new_dir}")
                os.rename(old_dir, new_dir)


# Renombra archivos y carpetas antes de dividir
rename_files_and_dirs(input_folder)

# Porcentajes para la división: (train, validation, test)
split_ratios = (0.8, 0.1, 0.1)

# Asegúrate de que la carpeta de entrada exista
if not os.path.exists(input_folder):
    print(f"Error: La carpeta de entrada '{input_folder}' no existe.")
else:
    print(f"Dividiendo imágenes de '{input_folder}'...")
    splitfolders.ratio(
        input_folder,
        output=output_folder,
        seed=42,
        ratio=split_ratios,
        group_prefix=None,
    )
    print(f"¡División completada! Las carpetas se encuentran en '{output_folder}'.")
