const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authChecker = require('../auth/auth-checker');

//API routes
const User = require('../models/user');
const process = require('../config/nodemon');

// User Registration
router.post('/signup', (req, res, next) => 
{
    User.find({username:req.body.username})
    .exec()
    .then(user => 
    {
        if (user.length>=1)
        {
            return res. status(409).json(
            {
                message: 'That username is already taken'
                //Database successfully searched; username already exists
            });
        }

        else
        {
            bcrypt.hash(req.body.userPass, 10, (err, hash) => 
            {
                if (err) 
                {
                    return res.status(500).json(
                    {
                        error:err
                        //Authentication process unsuccessful; JWT Authentication failed to compare the passwords 
                    });
                }

                else 
                {
                    const user = new User(
                    {
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
                        res.status(201).json(
                        {
                            message: 'User Created',
                            createdUser: 
                            {
                                _id: result._id,
                            }
                            //Authentication process successful; username and password correct
                        });
                    })
                    .catch(err => 
                    {
                        console.log(err);
                        res.status(500).json(
                        {
                            error:err
                            //Error: unable to save the user to the database
                        });
                    });
                }
            });
        }
    })
});

// Start protected routes

// User Login
router.post("/login", (req, res, next) => 
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
                //Database successfully searched; username not found
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
                const token = jwt.sign(
                {
                    username: user[0].username,
                    userId: user[0]._id
                },
                process.env.JWTkey,
                {
                    expiresIn: "1h"
                });
                return res.status(200).json(
                {
                    message: "Authentication successful",
                    token: token
                    //Authentication process successful; username and password correct 
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
router.delete('/:userId', authChecker, (req, res, next) =>
{   
    const id = req.params.userId;

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

        else
        {
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
                    User.remove({_id: req.params._id})
                    .exec()
                    .then(result => 
                    {
                        res.status(200).json(
                        {
                            message: 'User Deleted'
                            //Authentication process successful; username and password correct
                        });
                    })
                    .catch(err => 
                    {
                        console.log(err);
                        res.status(500).json(
                        {
                            error:err
                            //Error: unable to delete the user from the database
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
        }
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