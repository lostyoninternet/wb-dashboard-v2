const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
    nmId: {
        type: Number,
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true
    },
    sales: {
        quantity: Number,
        revenue: Number
    },
    stocks: {
        quantity: Number
    },
    views: {
        total: Number,
        unique: Number
    },
    addToCart: {
        total: Number,
        unique: Number
    },
    orders: {
        quantity: Number,
        revenue: Number,
        canceled: {
            quantity: Number,
            revenue: Number
        }
    }
}, {
    timestamps: true
});

// Составной индекс для быстрого поиска по nmId и дате
statisticsSchema.index({ nmId: 1, date: 1 });

module.exports = mongoose.model('Statistics', statisticsSchema);
