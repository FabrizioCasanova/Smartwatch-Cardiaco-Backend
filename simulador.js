const { Client, Message } = require("azure-iot-device");
const { Mqtt } = require("azure-iot-device-mqtt");

// Reemplaza con tu Connection String del dispositivo
const connectionString = "HostName=RelojInteligente-Cardiaco.azure-devices.net;DeviceId=SensorRitmoCardiaco;SharedAccessKey=QEojUjkTmzzvrDRgUyvLo6ddIHlnCQtjaT48O1fvALQ=";

// Crear el cliente MQTT
const client = Client.fromConnectionString(connectionString, Mqtt);

const sendMessage = async () => {
  try {
    const bpm = Math.floor(Math.random() * (120 - 60 + 1)) + 60; // Simula entre 60 y 120 bpm
    const timestamp = new Date().toISOString();
    const temperature = (Math.random() * (37.5 - 36) + 36).toFixed(1)// 36.0-37.5°C
    const sistolica = Math.floor(Math.random() * (140 - 100) + 100);
    const diastolica = Math.floor(Math.random() * ((sistolica - 50) - 60) + 60);
    
    const presion = { sistolica, diastolica };
    const o2InBlood = Math.floor(Math.random() * (100 - 95) + 95) // Oxígeno en sangre entre 95 y 100%

    const message = new Message(JSON.stringify({ bpm, timestamp, temperature, o2InBlood, presion }));
    console.log(`Enviando: ${message.getData()}`);

    await client.sendEvent(message);
    console.log("✅ Mensaje enviado correctamente");
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};

// Conectar al IoT Hub y enviar datos cada 5 segundos
client.open((err) => {
  if (err) {
    console.error("❌ No se pudo conectar:", err.message);
  } else {
    console.log("✅ Conectado al IoT Hub");
    setInterval(sendMessage, 10000);
  }
});
