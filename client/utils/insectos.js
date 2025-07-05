import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

// Rutas a tus archivos de modelo convertidos en la carpeta assets/model
// Asegúrate de que los nombres de los archivos .bin coincidan con los generados
const modelJson = require("../assets/insectos_tfjs/model.json");
const modelWeights = [
  require("../assets/insectos_tfjs/group1-shard1of3.bin"),
  require("../assets/insectos_tfjs/group1-shard2of3.bin"),
  require("../assets/insectos_tfjs/group1-shard3of3.bin"),
];

export let insectsModel = null;
export const INSECTS = [
  "arana-mona",
  "bachaco",
  "bachaco-culon",
  "libelula",
  "saltamontes",
];

// Función para cargar el modelo
export const loadInsectsModel = async () => {
  if (insectsModel !== null) {
    console.warn("Modelo ya cargado.");
    return insectsModel;
  }
  try {
    console.log("Cargando modelo...");
    await tf.ready();
    insectsModel = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights)
    );
    console.log("Modelo cargado exitosamente.");
    return insectsModel;
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
    return null;
  }
};
