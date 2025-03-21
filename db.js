const mongoose = require("mongoose");

const URI = "mongodb+srv://fabriziocasanova:EgWOQRON6N1gses3@smartwatch-cardiaco.k4a9b.mongodb.net/?retryWrites=true&w=majority&appName=Smartwatch-Cardiaco";

const connectDB = async () => {
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Conectado a MongoDB Atlas");
    } catch (error) {
        console.error("❌ Error conectando a MongoDB Atlas:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
