const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Amritisnew@@"

//Route1: Create a user using: POST "/api/auth/". Doesn't require Auth
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('username', 'Username must be at least 5 characters').isLength({min: 5}),
    body('password', 'Password must be at least 6 characters').isLength({min: 6}),
] , async (req, res) => {

//if there are errors return bad request and the errors    
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Try-catch to catch any unwanted error
    try
    {
        //Check weather the username and email is unique
        let user = await User.findOne({email: req.body.email});
        if(user) {
            return res.status(400).json({error: "Enter a different email"})
        } else {
            user = await User.findOne({username: req.body.username});
            if(user) {
                return res.status(400).json({error: "Enter a different Username"})
            }
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // New user created
        user = await User.create({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data = {
            user: {
                id: user._id,
            }
        }
        success = true;
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken ,success});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }

});

// Route2: Authenticate a user using: /POST "/api/auth/login". No login required
router.post('/login', [
    body('username', 'Username cannot be blank').exists(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {username, password} = req.body;
    try {
        let user = await User.findOne({username: username});
        if(!user) {
            return res.status(400).json({eroor: "Please try to login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            return res.status(400).json({eroor: "Please try to login with correct credentials"});
        }

        const payload = {
            user: {
                id: user._id,
            }
        }
        const authToken = jwt.sign(payload, JWT_SECRET);
        success = true;
        res.send({authToken, success});

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});

// Route 3: Get looged in user details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server error");
    }
});



module.exports = router;