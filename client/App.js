import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CameraScreen } from "./components/CameraScreen";
import { useEffect } from "react";
import { loadAnimalsModel } from "./utils/animales";
import { loadInsectsModel } from "./utils/insectos";

export default function App() {
  useEffect(function loadAllModels() {
    // Cargar modelos de animales e insectos
    loadAnimalsModel();
    loadInsectsModel();
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="light" />
        <CameraScreen />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    alignItems: "center",
    justifyContent: "center",
  },
});
