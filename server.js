//Codigo con Mongo

const { EventHubConsumerClient } = require("@azure/event-hubs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db"); // Conexión a MongoDB
const HeartRate = require("./models/heartRate"); // Importa el modelo
const startSimulator = require("./simulador"); // Importamos el simulador como un módulo

// Conectar a MongoDB Atlas
connectDB();

const connectionString = "Endpoint=sb://ihsuprodcqres003dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=TDCOtPe1e4iJNh68VwQFbP98tCPoGQzc3AIoTOzpGtY=;EntityPath=iothub-ehub-relojintel-57120644-4756147146";
const eventHubName = "iothub-ehub-relojintel-57120644-4756147146";
const consumerGroup = "$Default";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://smartwach-cardiaco-backend-b7hsf9b8a4fwhadt.brazilsouth-01.azurewebsites.net/",
  "https://polite-tree-0e598710f.6.azurestaticapps.net/"
];

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("No permitido por CORS"));
      }
    },
    methods: ["GET", "POST"]
  }
});

// Definir el puerto
const port = process.env.PORT || 8080;

// Conectar con Event Hub
const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);

const receiveMessages = async () => {
  console.log("📡 Escuchando mensajes de Event Hub...");
  consumerClient.subscribe({
    processEvents: async (events, context) => {
      for (const event of events) {
        console.log("📩 Mensaje recibido:", JSON.stringify(event.body));

        // Guardar en MongoDB
        try {
          const newEntry = new HeartRate(event.body);
          await newEntry.save();
          console.log("✅ Datos guardados en MongoDB");
        } catch (error) {
          console.error("❌ Error guardando en MongoDB:", error.message);
        }

        // Enviar datos en tiempo real a React
        io.emit("newData", event.body);
      }
    },
    processError: async (err, context) => {
      console.error("⚠️ Error en Event Hub:", err.message);
    },
  });
};

// Iniciar la escucha de eventos
receiveMessages();

// Iniciar el simulador
startSimulator();

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en el puerto ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>🚀 Backend del Smartwatch Cardiaco está funcionando perfectamente! 🔥</h1>");
});

// Middleware para manejar rutas inexistentes
app.use((req, res) => {
  res.status(404).send("❌ Ruta no encontrada en el backend.");
});