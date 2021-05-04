const mongoose = require('mongoose');

// stock section
const forexSchema = new mongoose.Schema({
    ev: {
        type: String,
        required: true
    },
    pair: {
        type: String,
        required: true
    },
    o: {
        type: String,
        required: true,
    },
    c: {
        type: String,
        required: true,
    },
    h: {
        type: String,
        required: true
    },
    l: {
        type: String,
        required: true
    },
    v: {
        type: String,
    },
    s: {
        type: String,
        required: true
    },
    e: {
        type: String,
        required: true
    }
});

// blog
const Forex = new mongoose.model('forex', forexSchema);

module.exports = Forex;