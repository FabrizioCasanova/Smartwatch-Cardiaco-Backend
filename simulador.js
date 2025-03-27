
const { Client, Message } = require("azure-iot-device");
const { Mqtt } = require("azure-iot-device-mqtt");

const connectionString = "HostName=RelojInteligente-Cardiaco.azure-devices.net;DeviceId=SensorRitmoCardiaco;SharedAccessKey=QEojUjkTmzzvrDRgUyvLo6ddIHlnCQtjaT48O1fvALQ=";

const client = Client.fromConnectionString(connectionString, Mqtt);

const sendMessage = async () => {
  try {
    const bpm = Math.floor(Math.random() * (120 - 60 + 1)) + 60;
    const timestamp = new Date().toISOString();
    const temperature = (Math.random() * (37.5 - 36) + 36).toFixed(1);
    const sistolica = Math.floor(Math.random() * (140 - 100) + 100);
    const diastolica = Math.floor(Math.random() * ((sistolica - 50) - 60) + 60);
    const presion = { sistolica, diastolica };
    const o2InBlood = Math.floor(Math.random() * (100 - 95) + 95);

    const message = new Message(JSON.stringify({ bpm, timestamp, temperature, o2InBlood, presion }));
    console.log(`📤 Enviando: ${message.getData()}`);

    await client.sendEvent(message);
    console.log("✅ Mensaje enviado correctamente");
  } catch (err) {
    console.error("❌ Error enviando mensaje:", err.message);
  }
};

// Exportar función para ejecutar el simulador
module.exports = () => {
  client.open((err) => {
    if (err) {
      console.error("❌ No se pudo conectar al IoT Hub:", err.message);
    } else {
      console.log("✅ Simulador conectado al IoT Hub");
      setInterval(sendMessage, 10000);
    }
  });
};
