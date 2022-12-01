require('dotenv').config();
const express = require('express');
const jwt = require ('jsonwebtoken');
const verifyToken = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

//@route PUT /api/profile
//@desc edit profile
//@accessability private
router.put('/', verifyToken, async (req, res) => {
    const { username,password } = req.body;

    //validation
    if (!username || !password)
        return res.status(400).json({success: false, message: 'Missing username or password'});
    
    //check for existing username
    try {
        const existedUser = await User.findOne({_id: req.userId});
        if (existedUser) 
            return res.status(400).json({success: false, message: 'Username already exists'});

        //update
        let updatedUser = {
            username,
            password
        }
        updatedUser = await User.findOneAndUpdate({_id: req.userId}, updatedUser, {new: true});
        res.json({success: true, message: 'Update successful', updatedUser});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
});

module.exports = router;