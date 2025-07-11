import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { species } from "../constants/data";

const { width, height } = Dimensions.get("window");

export function DetectedModal({ showModal, setShowModal, data, setData }) {
  const [showSpeciesMenu, setShowSpeciesMenu] = useState(false);

  function closeModal() {
    setShowModal(false);
  }

  function handleSpeciesSelect(specie) {
    setShowSpeciesMenu(false);
    setData({ ...specie, image: data.image });
  }

  const displayData = data;

  return (
    <>
      <Modal transparent={showModal} animationType="fade" visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={displayData.image ? { uri: displayData.image } : null}
                style={styles.image}
                resizeMode="cover"
              ></ImageBackground>
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.textWrapper}>
                <Text style={styles.title}>{displayData.name}</Text>
                <Text style={styles.subtitle}>
                  {displayData.scientificName}
                </Text>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={closeModal}>
                <Text style={styles.nextButtonText}>Nueva foto</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.speciesButton}
                onPress={() => setShowSpeciesMenu(true)}
              >
                <Text style={styles.speciesButtonText}>
                  Seleccionar especie
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para seleccionar especie */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={showSpeciesMenu}
        onRequestClose={() => setShowSpeciesMenu(false)}
      >
        <View style={styles.speciesModalOverlay}>
          <View style={styles.speciesModalContent}>
            <Text style={styles.speciesModalTitle}>Selecciona una especie</Text>
            <ScrollView style={styles.speciesScrollView}>
              {species.map((specie) => (
                <TouchableOpacity
                  key={specie.id}
                  style={styles.speciesOption}
                  onPress={() => handleSpeciesSelect(specie)}
                >
                  <Text style={styles.speciesOptionText}>{specie.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.speciesModalCloseButton}
              onPress={() => setShowSpeciesMenu(false)}
            >
              <Text style={styles.speciesModalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Fondo oscuro semitransparente
  },
  modalContent: {
    width: width * 0.9, // 90% del ancho de pantalla
    maxHeight: height * 0.8, // 80% del alto de pantalla
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageContainer: {
    height: height * 0.4, // 40% del alto de pantalla
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    padding: 20,
    alignItems: "center",
  },
  textWrapper: {
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: "#85b720",
    paddingVertical: 16,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  speciesButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 8,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  speciesButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  speciesModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  speciesModalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width * 0.85,
    maxHeight: height * 0.7,
    padding: 20,
    alignItems: "center",
  },
  speciesModalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#007AFF",
  },
  speciesScrollView: {
    width: "100%",
    marginBottom: 12,
  },
  speciesOption: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  speciesOptionText: {
    fontSize: 16,
    color: "#007AFF",
  },
  speciesModalCloseButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  speciesModalCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
