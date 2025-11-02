const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

//Register User
exports.register = async (req, res) => {
    const {email, password} = req.body;
    try{
        let user = await User.findOne({where: {email} });
        if(user) return res.status(400).json({ msg: "User already exists"});

        const newUser = await User.create({email, password});
        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(201).json({msg: "User created successfully", token});
    } catch (err) {
        res.status(500).json({msg: "Internal Server error", error: err.message});
    }
};

//Login User
exports.login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.findOne({where: {email}});
        if(!user) return res.status(401).json({msg: "Invalid email or password."});

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return res.status(401).json({msg: "Invalid email or password"});

        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({msg: "Login successful ", token});
    } catch (err){
        res.status(500).json({err: "Server Error."});
    }
};

exports.profile = async (req, res) => {
    res.json({
        message: "User profile",
        id: req.user.id,
        username: req.user.username,
        role: req.user.role
    });
}
