const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const bodyParser = require('body-parser');

const multer = require('multer');

const upload = multer({dest: 'uploads/'});

//   START
// Get Information on ALL products
router.get('/', (req, res, next) => {
    Product.find()
    .select('_id title askingPrice productImage1')
    .exec()
    .then(docs => {
        //console.log(docs);
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    _id: doc._id,
                    title: doc.title,
                    askingPrice: doc.askingPrice,
                    productImage1: doc.productImage1,
                        request: {
                            type: 'GET',
                            description: 'GET all information for a posted item:',
                            url: 'https://localhost:3000/products/'+doc._id
                        }
                }
            })
        }
        if (docs.length >= 0) {
            res.status(200).json(response);
        } else {
            res.status(200).json({
                message: 'No Current Entries'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// NEW Post Product Information
router.post('/', upload.single('productImage1'), upload.single('productImage2'), 
                 upload.single('productImage3'), upload.single('productImage4'), 
                 (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        productImage1: req.file.path,
        productImage2: req.file.path,
        productImage3: req.file.path,
        productImage4: req.file.path,
        askingPrice: req.body.askingPrice,
        dateOfPosting: req.body.dateOfPosting,
        deliveryType: req.body.deliveryType,
        sellerName: req.body.sellerName,
        sellerContactInfo: req.body.sellerContactInfo
    });
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Item Posted",
            createdProduct: {
                _id: result._id,
                title: result.title,
                    request: {
                        type: 'GET',
                        descition: 'View all details of the posted item:',
                        url: 'http://localhost:3000/products/'+result._id
                    }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Get by product Id
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log("From database", doc);
        if(doc) {
            res.status(200).json(doc);
        } else{
            res.status(404).json({
                message: 'No valid entry for Id'
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Change a Product's by Id
router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id}, { $set: updateOps })
    .exec()
    .then(res => {
        console.log(result);
        res.status(200).json({
            message: 'Product Updated',
            request: {
                type: 'GET',
                description: 'View all details of the updated item:',
                url: 'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

//Delete by Product by Id
router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;