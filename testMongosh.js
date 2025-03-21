const mongoose = require("mongoose");

const URI = "mongodb+srv://fabriziocasanova:EgWOQRON6N1gses3@smartwatch-cardiaco.k4a9b.mongodb.net/?retryWrites=true&w=majority&appName=Smartwatch-Cardiaco";

async function connectDB() {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Tiempo de espera para seleccionar un servidor
    });
    console.log("✅ Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB Atlas:", error);
  }
}

connectDB();
