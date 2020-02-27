const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: false },
    description: { type: String, required: false }, 
    category: { type: String, required: false },
    location: { type: String, required: false },
    productImage1: { type: String, required: false },
    askingPrice: { type: Number, required: false },
    dateOfPosting: { type: String, required: false },
    deliveryType: { type: String, required: false },
    sellerName: { type: String, required: false },
    username: {type: String, required: false },
    sellerContactInfo: { type: String, required: false }

});

module.exports = Item = mongoose.model('Product', productSchema);