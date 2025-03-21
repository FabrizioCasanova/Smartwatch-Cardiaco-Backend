const mongoose = require("mongoose");

const HeartRateSchema = new mongoose.Schema({
    bpm: Number,
    temperature: Number,
    o2InBlood: Number,
    presion: {
        sistolica: Number,
        diastolica: Number
    },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("HeartRate", HeartRateSchema);

