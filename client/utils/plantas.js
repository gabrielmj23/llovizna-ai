import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

// Rutas a tus archivos de modelo convertidos en la carpeta assets/model
// Asegúrate de que los nombres de los archivos .bin coincidan con los generados
const modelJson = require("../assets/plantas_tfjs/model.json");
const modelWeights = [
  require("../assets/plantas_tfjs/group1-shard1of3.bin"),
  require("../assets/plantas_tfjs/group1-shard2of3.bin"),
  require("../assets/plantas_tfjs/group1-shard3of3.bin"),
];

export let plantsModel = null;
// Lista de plantas según tu dataset, en el mismo orden que las clases del modelo
export const PLANTS = [
  "araguaney",
  "arbolada-mango",
  "ave-paraiso",
  "canafistola",
  "caoba",
  "cayena",
  "cedro",
  "ceiba",
  "chaguaramo",
  "coralito",
  "corona-cristo",
  "indio-desnudo",
  "jacaranda",
  "palma-africana",
  "ucaro",
];

// Función para cargar el modelo
export const loadPlantsModel = async () => {
  if (plantsModel !== null) {
    console.warn("Modelo ya cargado.");
    return plantsModel;
  }
  try {
    console.log("Cargando modelo...");
    await tf.ready();
    // Usa tf.loadLayersModel para modelos convertidos desde Keras/TF (model.json + .bin)
    plantsModel = await tf.loadGraphModel(
      bundleResourceIO(modelJson, modelWeights)
    );
    console.log("Modelo cargado exitosamente.");
    return plantsModel;
  } catch (error) {
    console.error("Error al cargar el modelo:", error);
    return null;
  }
};
