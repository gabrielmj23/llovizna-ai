import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

export function DetectedModal({showModal, setShowModal, data}) {

  function closeModal() {
    setShowModal(false);
  }
  console.log("DetectedModal data:", data);
  return (
    <Modal
      transparent={showModal}
      animationType="fade"
      visible={showModal} 
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.imageContainer}>
            <ImageBackground
              source={data.image}
              style={styles.image}
              resizeMode="cover">
            </ImageBackground>
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{data.name}</Text>
              <Text style={styles.subtitle}>
                {data.scientificName}
              </Text>
            </View>

            <TouchableOpacity style={styles.nextButton} onPress={closeModal}>
              <Text style={styles.nextButtonText}>Nueva foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Fondo oscuro semitransparente
  },
  modalContent: {
    width: width * 0.9, // 90% del ancho de pantalla
    maxHeight: height * 0.8, // 80% del alto de pantalla
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
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
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  textWrapper: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  nextButton: {
    backgroundColor: '#85b720',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});