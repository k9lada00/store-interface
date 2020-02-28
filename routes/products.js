const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

//Image upload
const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination: function(req, file, cb)
        {
            cb(null, './uploads');
        },

        filename: function(req, file, cb)
        {
            cb(null, file.originalname);
        }
    }
);
const upload = multer({storage: storage});

//API routes
const User = require('../models/user');
const Product = require('../models/product');
const authChecker = require('../auth/auth-checker');
const process = require('../config/nodemon');

// Post Product Information
router.post('/', authChecker, upload.single('productImage1'), (req, res, next) => 
{
    const product = new Product(
    {
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        productImage1: req.file.path,
        askingPrice: req.body.askingPrice,
        dateOfPosting: req.body.dateOfPosting,
        deliveryType: req.body.deliveryType,
        sellerName: req.body.sellerName,
        sellerContactInfo: req.body.sellerContactInfo
    });

    product
    .save()
    .then(result => 
    {
        console.log(result);
        res.status(201).json(
        {
            message: "Item Posted",
            createdProduct: 
            {
                _id: result._id,
                title: result.title,
                request: 
                {
                    type: 'GET',
                    descition: 'View all details of the posted item:',
                    url: 'http://localhost:3000/search/'+result._id
                }
            }
        });
    })
    .catch(err => 
    {
        console.log(err);
        res.status(500).json(
        {
            error: err
        });
    });
});

//Change a product by Id
router.patch('/:productId', authChecker, (req, res, next) => 
{
    const id = req.params.productId;
    const updateOps = {};

    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }

    Product.update({ _id: id}, { $set: updateOps })
    .exec()
    .then(result => 
    {
        console.log(result);
        res.status(200).json(
        {
            message: 'Product Updated',
            request: 
            {
                type: 'GET',
                description: 'View all details of the updated item:',
                url: 'http://localhost:3000/search/'+id
            }
        });
    })
    .catch(err => 
    {
        console.log(err);
        res.status(500).json(
        {
            error: err
        });
    });
});

//Delete a product
router.delete('/:productId', authChecker, (req, res, next) => 
{
    const id = req.params.productId;
    
    Product.remove({ _id: id})
    .exec()
    .then(result => 
    {
        res.status(200).json(
        {
            message: 'Product Deleted'
        });
    })
    .catch(err => 
    {
        console.log(err);
        res.status(500).json(
        {
            error: err
        });
    });
});

module.exports = router;
