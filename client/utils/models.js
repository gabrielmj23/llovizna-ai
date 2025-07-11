import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";
import { decodeJpeg } from "@tensorflow/tfjs-react-native";

/**
 * Limpia la cadena Base64 eliminando el prefijo Data URI si está presente.
 * @param {string} base64String
 * @returns {string} La cadena Base64 limpia.
 */
const cleanBase64 = (base64String) => {
  const parts = base64String.split(",");
  if (parts.length > 1 && parts[0].startsWith("data:")) {
    return parts[1]; // Retorna solo la parte Base64 después de la coma
  }
  return base64String; // Retorna la cadena original si no hay prefijo
};

/**
 * Genera la predicción de una imagen a partir de un modelo especificado
 * @param {string} imageBase64
 * @param {tf.LayersModel?} model
 * @param {() => Promise<tf.LayersModel | null>} loadModel
 * @param {string[]} classLabels
 * @param {"Planta" | "Animal" | "Insecto"} modelType
 */
export const predictImage = async (
  imageBase64,
  model,
  loadModel,
  classLabels,
  modelType
) => {
  console.log("[predictImage] called");
  if (model === null) {
    console.log("[predictImage] Model is null, loading model...");
    model = await loadModel();
    if (model === null) {
      console.error(
        "[predictImage] No se pudo cargar el modelo para la predicción."
      );
      return null;
    }
    console.log("[predictImage] Model loaded");
  }

  try {
    console.log("[predictImage] Cleaning base64 string...");
    // Limpiar la cadena Base64 de posibles prefijos Data URI
    const cleanedBase64 = cleanBase64(imageBase64);

    console.log("[predictImage] Converting cleaned base64 to Uint8Array...");
    // Convertir la cadena base64 limpia a Uint8Array
    // `atob` es para decodificar base64 a una cadena binaria, y luego mapear a Uint8Array
    const binaryString = atob(cleanedBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(new ArrayBuffer(len));
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log("[predictImage] Decoding JPEG to tensor...");
    // Decodificar la imagen a tensor
    const imageTensor = decodeJpeg(bytes)
      .resizeBilinear([224, 224])
      .toFloat()
      .expandDims();

    console.log("[predictImage] Normalizing tensor...");
    console.log("[predictImage] Running prediction...");

    // Realizar la Predicción
    const predictions = model.predict(imageTensor);
    const predictionData = predictions.dataSync();

    console.log("[predictImage] Processing prediction results...");
    // Obtener la Clase Predicha
    const predictedClassIndex = predictionData.indexOf(
      Math.max(...predictionData)
    );
    const predictedClassName = classLabels[predictedClassIndex];
    const confidence = predictionData[predictedClassIndex] * 100;

    // Liberar la memoria del tensor
    imageTensor.dispose();
    predictions.dispose();

    console.log(
      "[predictImage] Prediction complete:",
      predictedClassName,
      confidence
    );
    return {
      className: predictedClassName,
      confidence: confidence.toFixed(2),
      allPredictions: predictionData,
    };
  } catch (error) {
    console.error("[predictImage] Error durante la predicción:", error);
    return null;
  }
};
