const { getDefaultConfig } = require("expo/metro-config"); // Si usas Expo

const config = getDefaultConfig(__dirname);

// Añade '.bin' a la lista de extensiones de activos que Metro debe reconocer
config.resolver.assetExts.push("bin");

module.exports = config;
