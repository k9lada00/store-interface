const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const authChecker = require('../auth/auth-checker');



// User Registration
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

// User Login
router.post("/login", (req, res, next) => 
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
                const token = jwt.sign(
                {
                    username: user[0].username,
                    userId: user[0]._id
                },
                process.env.JWTkey,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json(
                {
                    message: "Authentication successful",
                    token: token
                });
            }
            res.status(401).json(
            {
                message: "Incorrect Password"
            });
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

// Change a User by Id
router.patch('/:userId', authChecker, (req, res, next) => 
{
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body)
    {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id}, { $set: updateOps })
    .exec()
    .then(res => 
    {
        console.log(result);
        res.status(200).json(
        {
            message: 'User Updated',
            request: 
            {
                type: 'GET',
                description: 'View all details of the updated user:',
                url: 'http://localhost:3000/users/'+id
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

// User Delete
router.delete('/userId', authChecker, (req, res, next) =>
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