const User = require("../models/userModel.js");
const bcrypt = require('bcryptjs');

const getAllUser = async(req,res,next) => {
    let users
    try {
        users = await User.find()
    }catch (err){
        console.log(err)
    }
    if (!users) {
        return res.status(404).json({message: "no users found"})
    }
    return res.status(200).json({users})
}

const signup = async (req,res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    let existingUser;
    try{
        existingUser = await User.findOne({email})
    }catch (err){
       return  console.log(err)
    }
    if (existingUser){
        return res.status(400).json({message:"user already exists"})
    }
    const hashedPassword = bcrypt.hashSync(password)
    const user = new User({
        username, 
        email,
        password: hashedPassword,
        });
    
    try {
        await user.save();
        req.session.userId = user._id.toString();
        req.session.save(err => { 
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ message: "Session error, please try again." });
            }
            res.redirect('/movies');
        });
    }catch(err){
        return console.log(err)
    }
}

const login = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let existingUser;
    try{
        existingUser = await User.findOne({email})
    }catch (err){
       return  console.log(err)
    }
    if (!existingUser){
        return res.status(404).json({message:"user is not found by this email"})
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password)

    if (!isPasswordCorrect){
        return res.status(400).json({message:"incorrect password"})
    }
    req.session.userId = existingUser._id.toString();
    req.session.isAdmin = existingUser.admin;
    req.session.save(err => {
        if (err) {
            console.error("Session save error:", err);
            return res.status(500).json({ message: "Session error, please try again." });
        }
        res.redirect('/movies');
    });   
}

const getHistory = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId)
                               .populate('history.refId')
                               .lean();

        if (!user) {
            return res.status(404).send('User not found');
        }


        res.render('history', { 
            user: user,
            history: user.history || []
        });
    } catch (error) {
        console.error("Error fetching user history:", error);
        res.status(500).send('Internal Server Error');
    }
};


const getSignUp = async(req,res,next)=>{
    res.render('signup');
}

const getLogin = async(req,res,next)=>{
    res.render('login');
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // Assuming the user ID is passed as a URL parameter
        await User.findByIdAndDelete(userId);
        res.send("User deleted successfully.");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Failed to delete user.");
    }
};
const renderAdminPage = async (req, res) => {
    try {
        const users = await User.find({});
        res.render('admin', { users: users });
    } catch (error) {
        console.error('Failed to fetch users for admin page:', error);
        res.status(500).send('Error loading admin page');
    }
};

module.exports = {
    deleteUser,
    renderAdminPage,
    getAllUser,
    getSignUp,
    getLogin,
    signup,
    login,
    getHistory,
};