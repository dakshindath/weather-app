const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res)=>{
    const { username, email, password} = req.body;
    try{
        const existinguser = await User.findOne({ email});
        if(existinguser){
            return res.status(400).json({ message : "user already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password: hashedPassword});
        await newUser.save();

        res.status(201).json({ message: "user created successfully"});
    }
    catch(err){
        res.status(500).json({ message: "error sigining up"});
    }
};

const login = async (req, res)=>{
    const { email, password } = req.body;
    try{
        const foundUser = await User.findOne({email});
        if(!foundUser){
            return res.status(400).json({ message: "User not found"});
        }
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if(!isPasswordValid){
            return res.status(400).json({ message: "invalid credentails"});
        }
        const token = jwt.sign({ id: foundUser._id}, JWT_SECRET, { expiresIn: '1hr'});
        res.json({token});       
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "error logging in"})
    }
};

module.exports ={ signup, login};

