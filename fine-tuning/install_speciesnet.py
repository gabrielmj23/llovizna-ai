import kagglehub

# Download latest version
path = kagglehub.model_download("google/speciesnet/keras/v4.0.0b")

print("Path to model files:", path)
