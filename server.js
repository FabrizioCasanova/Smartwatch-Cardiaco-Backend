const { EventHubConsumerClient } = require("@azure/event-hubs");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const connectionString = "Endpoint=sb://ihsuprodcqres003dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=TDCOtPe1e4iJNh68VwQFbP98tCPoGQzc3AIoTOzpGtY=;EntityPath=iothub-ehub-relojintel-57120644-4756147146"; // Tu conexión de Event Hub
const eventHubName = "iothub-ehub-relojintel-57120644-4756147146";
const consumerGroup = "$Default"; // Nombre del grupo de consumidores (por defecto)

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST"]
  },
});

// Definir el puerto (por ejemplo, 5000)
const port = process.env.PORT || 8080;
// Conectar con Event Hub
const consumerClient = new EventHubConsumerClient(
  consumerGroup,
  connectionString,
  eventHubName
);

const receiveMessages = async () => {
  consumerClient.subscribe({
    processEvents: async (events, context) => {
      for (const event of events) {
        console.log("Mensaje recibido:", event.body);
        io.emit("newData", event.body); // Enviar datos a React en tiempo real
      }
    },
    processError: async (err, context) => {
      console.error("Error en Event Hub:", err.message);
    },
  });
};

receiveMessages();


server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
