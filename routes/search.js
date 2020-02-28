const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');
const bodyParser = require('body-parser');

//API routes
const User = require('../models/user');
const Product = require('../models/product');
const authChecker = require('../auth/auth-checker');

//SEARCH
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
                            url: 'http://localhost:3000/search/'+doc._id
                        }
                }
            }),
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
router.get('/:category', (req, res, next) => 
{
    const cat = req.params.category;
    
    Product.find()
    .select('_id title category askingPrice')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            message: 'Try searching the following categories: electronics, clothing, kitchen, home...',
            products: docs.map(doc => 
            {
                if (req.params.category === doc.category)
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
                            url: 'http://localhost:3000/search/'+doc._id
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
                message: 'No Current Entries',
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
router.get('/:location', (req, res, next) => 
{
    const loc = req.params.location;

    Product.find()
    .select('_id title location askingPrice')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            message: 'Try searching by country name with correct capitalization: Finland, Sweden, Russia, Norway, Estonia, etc.',
            products: docs.map(doc => 
            {
                if (req.params.location === doc.location)
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
                            url: 'http://localhost:3000/search/'+doc._id
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
router.get('/:dateOfPosting', (req, res, next) => 
{
    const dat = req.params.dateOfPosting;

    Product.find()
    .select('_id title dateOfPosting askingPrice')
    .exec()
    .then(docs => 
    {
        const response = 
        {
            message: 'Try searching dates in DD-Mon-YYYY format with abbrieviated month titles (uppercase) and spaces. Example: 15 FEB 2020',
            products: docs.map(doc => 
            {
                if (req.params.dateOfPosting === doc.dateOfPosting)
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
                            url: 'http://localhost:3000/search/'+doc._id
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

module.exports = router;
