const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//const moment = require('moment');
const bodyParser = require('body-parser');
const multer = require('multer');
///*
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
//*/
//const upload = multer({dest: 'uploads/'});


const User = require('../models/user');
const Product = require('../models/product');
const authChecker = require('../auth/auth-checker');

// Get Information on all products
router.get('/', (req, res, next) => 
{
    Product.find()
    .select('_id title askingPrice productImage1')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            count: docs.length,
            products: docs.map(doc => 
            {
                return {
                    _id: doc._id,
                    title: doc.title,
                    askingPrice: doc.askingPrice,
                    productImage1: doc.productImage1,
                        request: 
                        {
                            type: 'GET',
                            description: 'GET all information for a posted item:',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                }
            })
        }

        if (docs.length >= 0) 
        {
            res.status(200).json(response);
        } 

        else 
        {
            res.status(200).json(
            {
                message: 'No Current Entries'
            });
        }
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

//Get by product category
router.get('/category', (req, res, next) => 
{
    Product.find()
    .select('_id title category askingPrice')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            count: docs.length,
            products: docs.map(doc => 
            {
                if (req.body.category === doc.category)
                {
                    return {
                    _id: doc._id,
                    title: doc.title,
                    category: doc.category,
                    askingPrice: doc.askingPrice,
                        request: 
                        {
                            type: 'GET',
                            description: 'GET all information for a posted item:',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                }
            })
        }
        if (docs.length >= 0) 
        {
            res.status(200).json(response);
        } 

        else 
        {
            res.status(200).json(
            {
                message: 'No Current Entries'
            });
        }
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

//Get by product location
router.get('/location', (req, res, next) => 
{
    Product.find()
    .select('_id title location askingPrice')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            count: docs.length,
            products: docs.map(doc => 
            {
                if (req.body.location === doc.location)
                {
                    return {
                    _id: doc._id,
                    title: doc.title,
                    location: doc.location,
                    askingPrice: doc.askingPrice,
                        request: 
                        {
                            type: 'GET',
                            description: 'GET all information for a posted item:',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                }
            })
        }
        if (docs.length >= 0) 
        {
            res.status(200).json(response);
        } 

        else 
        {
            res.status(200).json(
            {
                message: 'No Current Entries'
            });
        }
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

//Get by product date
router.get('/date', (req, res, next) => 
{
    Product.find()
    .select('_id title dateOfPosting askingPrice')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            count: docs.length,
            products: docs.map(doc => 
            {
                if (req.body.dateOfPosting === doc.dateOfPosting)
                {
                    return {
                    _id: doc._id,
                    title: doc.title,
                    dateOfPosting: doc.dateOfPosting,
                    askingPrice: doc.askingPrice,
                        request: 
                        {
                            type: 'GET',
                            description: 'GET all information for a posted item:',
                            url: 'http://localhost:3000/products/'+doc._id
                        }
                    }
                }
            })
        }
        if (docs.length >= 0) 
        {
            res.status(200).json(response);
        } 

        else 
        {
            res.status(200).json(
            {
                message: 'No Current Entries'
            });
        }
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

//Get by product Id
router.get('/:productId', (req, res, next) => 
{
    const id = req.params.productId;

    Product.findById(id)
    .exec()
    .then(doc => 
    {
        console.log("From database", doc);
        if(doc) 
        {
            res.status(200).json(doc);
        } 

        else
        {
            res.status(404).json(
            {
                message: 'No valid entry for Id'
            });
        }
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

// START PROTECTED ROUTES

// Post Product Information
router.post('/', authChecker, upload.single('productImage1'), (req, res, next) => 
{
    User.find({ username: req.body.username })
    .exec()
    .then(user => 
    {
        if (user.length < 1) 
        {
            return res.status(401).json(
            {
                message: "Username not found"
            });
        }
    
    bcrypt.compare(req.body.userPass, user[0].userPass, (err, result) => 
        {
            if (err) 
            {
                return res.status(401).json(
                {
                    message: "Password Authentication Failed"
                });
            }

            if (result) 
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
                                    url: 'http://localhost:3000/products/'+result._id
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
                url: 'http://localhost:3000/products/'+id
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

//Delete by Product by Id
router.delete('/:productId', authChecker, (req, res, next) => 
{
    User.find({ username: req.body.username })
    .exec()
    .then(user => 
    {
        if (user.length < 1) 
        {
            return res.status(401).json(
            {
                message: "Username not found"
            });
        }
    
    bcrypt.compare(req.body.userPass, user[0].userPass, (err, result) => 
        {
            if (err) 
            {
                return res.status(401).json(
                {
                    message: "Password Authentication Failed"
                });
            }

            if (result) 
            {    
    
                const id = req.params.productId;

                Product.remove({ _id: id})
                .exec()
                .then(result => 
                {
                    res.status(200).json(result);
                })
                .catch(err => 
                {
                    console.log(err);
                    res.status(500).json(
                    {
                        error: err
                    });
                });


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

module.exports = router;