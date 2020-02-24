const express = require('express');
const router = express.Router();
//const Product = require('../models/product');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//Route for User file
const User = require('../models/user');

router.post('/signup', (req, res, next) => 
{
    User.find({username:req.body.username})
    .exec()
    .then(user => 
        {
            if (user.length>=1)
            {
                return res. status(409).json
                    ({
                        message: 'That username is already taken'
                    });
            }
            else
            {
                bcrypt.hash(req.body.userPass, 10, (err, hash) => 
                {
                    if (err) 
                    {
                        return res.status(500).json
                        ({
                            error:err 
                        });
                    }
                    else 
                    {
                        const user = new User
                        ({
                            _id: new mongoose.Types.ObjectId(),
                            username: req.body.username,
                            firstLastName: req.body.firstLastname,
                            dateOfBirth: req.body.dateOfBirth,
                            userCC: req.body.userCC,
                            userEmail: req.body.userEmail,
                            userPass: hash
                        });
                        user.save()
                        .then(result => 
                            {
                                console.log(result);
                                res.status(201).json
                                ({
                                    message: 'User Created'
                                });
                            })
                        .catch(err => 
                            {
                                console.log(err);
                                res.status(500).json
                                ({
                                    error:err
                                });
                            });
                    }
                });
            }
        })
});

router.delete('/userId', (req, res, next) =>
{
    User.remove({_id: req.params._id})
    .exec()
    .then(result => 
        {
            res.status(200).json
            ({
                message: 'User Deleted'
            });
        })
    .catch(err => 
        {
            console.log(err);
            res.status(500).json
            ({
                error:err
            });
        });
});

module.exports = router; 