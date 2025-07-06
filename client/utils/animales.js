import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

// Rutas a tus archivos de modelo convertidos en la carpeta assets/model
// Asegúrate de que los nombres de los archivos .bin coincidan con los generados
const modelJson = require("../assets/animales_tfjs/model.json");
const modelWeights = [
  require("../assets/animales_tfjs/group1-shard1of3.bin"),
  require("../assets/animales_tfjs/group1-shard2of3.bin"),
  require("../assets/animales_tfjs/group1-shard3of3.bin"),
];

export let animalsModel = null;
export const ANIMALS = [
  "anaconda",
  "baba",
  "capibara",
  "iguana",
  "mono-capuchino",
  "pereza",
  "picure",
  "piranha",
  "ranita-minera",
  "tapir",
];

// Función para cargar el modelo
export const loadAnimalsModel = async () => {
  if (animalsModel !== null) {
    console.warn("Modelo ya cargado.");
    return animalsModel;
  }
  try {
    console.log("Cargando modelo...");
    await tf.ready();
    animalsModel = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights)
    );
    console.log("Modelo cargado exitosamente.");
    return animalsModel;
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
    return null;
  }
};
