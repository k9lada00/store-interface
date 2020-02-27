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

// START PROTECTED ROUTES

// Post Product Information
router.post('/', authChecker, upload.single('productImage1'), (req, res, next) => 
{
    //Username and Password Authentication

    User.find({ username: req.body.username })
    .exec()
    .then(user => 
    {
        if (user.length < 1) 
        {
            return res.status(401).json(
            {
                message: "Username not found"
                //Username database successfully searched; username not found
            });
        }
    
    bcrypt.compare(req.body.userPass, user[0].userPass, (err, result) => 
        {
            if (err) 
            {
                return res.status(401).json(
                {
                    message: "Password Authentication Failed"
                    //The JWT Authentication failed to compare the passwords
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
                    username: req.body.username,
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
                        //Authentication process successful; username and password correct
                    });
                })
                .catch(err => 
                {
                    console.log(err);
                    res.status(500).json(
                    {
                        error: err
                        //Error: unable to post the product to the database
                    });
                });
            }
            else
            {
                res.status(401).json(
                {
                    message: "Incorrect Password"
                    //Authentication process successful; password was incorrect
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
            //Authentication process unsuccessful; unable to search database for username
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

//Delete by Product by Id
router.delete('/:productId', authChecker, (req, res, next) => 
{
    //Username and Password Authentication
    
    User.find({ username: req.body.username })
    .exec()
    .then(user => 
    {
        if (user.length < 1) 
        {
            return res.status(401).json(
            {
                message: "Username not found"
                //Username database successfully searched; username not found
            });
        }
    
        bcrypt.compare(req.body.userPass, user[0].userPass, (err, result) => 
        {
            if (err) 
            {
                return res.status(401).json(
                {
                    message: "Password Authentication Failed"
                    //Authentication process unsuccessful; JWT Authentication failed to compare the passwords
                });
            }

            if (result) 
            {    
                const id = req.params.productId;

                //Username and Password Authenticated; now checking for username of the individual product

                Product.findById(id)
                .select('username')
                .exec()
                .then( docs =>
                {
                    if (req.body.username === doc.username)
                    {
                        //then allow the process to continue
                        Product.remove({ _id: id})
                        .exec()
                        .then(result => 
                        {
                            res.status(200).json(result);
                            //Authentication process successful; username and password correct
                        })
                        .catch(err => 
                        {
                            console.log(err);
                            res.status(500).json(
                            {
                                error: err
                                //Error: unable to delete the product from the database
                            });
                        });
                    }

                    else 
                    {
                        res.status(401).json(
                        {
                            message: 'Incorrect Password'
                            //Username and Password Authenticated; current user is not a match for the original poster
                        });
                    }
                })
                .catch(err => 
                {
                    console.log(err);
                    res.status(500).json(
                    {
                        error: err
                        //Error: unable to find product Id in the database
                    });
                });
            }

            else 
            {
                res.status(401).json(
                {
                    message: "Incorrect Password"
                    //Authentication process successful; password was incorrect
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
            //Authentication process unsuccessful; unable to search database for username
        });
    });
});

module.exports = router;