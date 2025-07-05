import { useRef, useState } from "react";
import { CameraView } from "expo-camera";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DetectedModal } from "./DetectedModal";
import { ExpoCamera } from "./ExpoCamera";
import { predictImage } from "../utils/models";
import { loadAnimalsModel, ANIMALS } from "../utils/animales";

const documentCategories = ["Planta", "Animal", "Insecto"];

export function CameraScreen() {
  const [selectedCategory, setSelectedCategory] = useState(
    documentCategories[1]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [prediction, setPrediction] = useState({
    name: "Capibara",
    scientificName: "Hydrochoerus hydrochaeris",
    image:
      "https://images.pexels.com/photos/11170943/pexels-photo-11170943.jpeg",
  });
  const cameraRef = useRef(null);

  async function requestInfo(imageBase64) {
    try {
      if (!imageBase64) return;
      const predictionResult = await predictImage(
        imageBase64,
        null,
        loadAnimalsModel,
        ANIMALS
      );
      if (predictionResult) {
        setPrediction({
          ...prediction,
          name: predictionResult.className,
          confidence: predictionResult.confidence,
        });
      } else {
        console.log("no predictionResult");
      }
      setIsOpen(true);
    } catch (error) {
      console.error("Error requesting information:", error);
      return;
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
        <TouchableOpacity style={styles.controlButton}>
          <Text style={styles.controlButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={async () => {
            console.log("Capturing image...");
            const image = await cameraRef.current?.takePictureAsync({
              base64: true,
            });
            await requestInfo(image?.base64 || null);
          }}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        <DetectedModal
          showModal={isOpen}
          setShowModal={setIsOpen}
          data={prediction}
        />
        <TouchableOpacity style={styles.controlButton}>
          <Icon name="refresh" size={30} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F0F2F5",
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: "#000",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  scanArea: {
    width: "80%",
    height: "80%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
  },
  sideBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
});
