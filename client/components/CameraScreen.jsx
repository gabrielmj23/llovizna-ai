import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DetectedModal } from "./DetectedModal";
import { ExpoCamera } from "./ExpoCamera";
import { predictImage } from "../utils/models";
import { loadAnimalsModel, ANIMALS, animalsModel } from "../utils/animales";
import { INSECTS, insectsModel, loadInsectsModel } from "../utils/insectos";
import { loadPlantsModel, PLANTS, plantsModel } from "../utils/plantas";
import * as ImageManipulator from "expo-image-manipulator";
import { species } from "../constants/data";

const documentCategories = ["Planta", "Animal", "Insecto"];

const categoryToModel = {
  Planta: {
    model: plantsModel,
    loadModel: loadPlantsModel,
    labels: PLANTS,
  },
  Animal: {
    model: animalsModel,
    loadModel: loadAnimalsModel,
    labels: ANIMALS,
  },
  Insecto: {
    model: insectsModel,
    loadModel: loadInsectsModel,
    labels: INSECTS,
  },
};

export function CameraScreen() {
  const [selectedCategory, setSelectedCategory] = useState(
    documentCategories[1]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [prediction, setPrediction] = useState({
    name: "",
    scientificName: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(null);

  function findSpeciesById(id) {
    return (
      species.find((s) => s.id === id) || {
        id: "unknown",
        name: "Desconocido",
        scientificName: "Desconocido",
        image: "https://placehold.co/300x300?text=Desconocido",
      }
    );
  }

  async function requestInfo(imageBase64) {
    try {
      if (!imageBase64) return;
      const modelForCategory = categoryToModel[selectedCategory];
      const predictionResult = await predictImage(
        imageBase64,
        modelForCategory.model,
        modelForCategory.loadModel,
        modelForCategory.labels,
        selectedCategory
      );
      if (predictionResult) {
        const especie = findSpeciesById(predictionResult.className);
        setPrediction({
          ...especie,
          name: predictionResult.className,
          confidence: predictionResult.confidence,
        });
        console.log("Prediction Result:", predictionResult);
        console.log("Species found:", especie);
      } else {
        console.log("no predictionResult");
      }
      setIsOpen(true);
    } catch (error) {
      console.error("Error requesting information:", error);
      return;
    } finally {
      setIsLoading(false);
    }
    console.log("Requesting information...");
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* <Camera /> */}
      <ExpoCamera cameraRef={cameraRef} />

      <View style={styles.categoriesBar}>
        {documentCategories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryButton}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomControls}>
        {/* <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>Cancel</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.captureButton}
          onPress={async () => {
            console.log("Capturing image...");
            const image = await cameraRef.current?.takePictureAsync();
            if (!image?.uri) return;
            setIsLoading(true);
            // Cambiar tamaño según la categoría seleccionada
            const resizeSize =
              selectedCategory === "Planta"
                ? { width: 460, height: 440 }
                : { width: 224, height: 224 };
            const manipulated = await ImageManipulator.manipulateAsync(
              image.uri,
              [{ resize: resizeSize }],
              {
                base64: true,
                compress: 1,
                format: ImageManipulator.SaveFormat.JPEG,
              }
            );
            await requestInfo(manipulated.base64);
          }}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <DetectedModal
          showModal={isOpen}
          setShowModal={setIsOpen}
          data={prediction}
        />
        {/* <TouchableOpacity style={styles.controlButton}>
          <Icon name="refresh" size={30} color="#007AFF" />
        </TouchableOpacity> */}
      </View>

      {/* Overlay de carga */}
      {isLoading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={{ marginTop: 16, color: "white" }}>
            Procesando imagen...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  overlayText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  categoriesBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "white",
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#007AFF",
    fontWeight: "bold",
    borderRadius: 5,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 30,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  controlButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    borderColor: "#007AFF",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
});
