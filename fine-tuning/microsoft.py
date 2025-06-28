from PytorchWildlife.models import classification as pw_classification

# Classification
classification_model = (
    pw_classification.AI4GAmazonRainforest()
)  # Model weights are automatically downloaded.
classification_results = classification_model.single_image_classification(img)
