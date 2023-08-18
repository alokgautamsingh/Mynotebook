const express = require('express');
const User = require('../models/User')
const router = express.Router();

const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = "alokisagoodboy";

/////// Route 1 creating a user   api/auth/createuser
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', "Enter a valid Email").isEmail(),
  body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success ,errors: errors.array() });
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
    }
    
    const salt = await bcrypt.genSalt(10);
    const setpass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: setpass
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success,authtoken});
  }
  catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


///Route 2 authrnticate a user  api/auth/login
router.post('/login', [

  body('email', "Enter a valid Email").isEmail(),
  body('password', "password cant be empty").exists()
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ error: "Please try to login with correct crudentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Please try to login with correct crudentials" })
    }


    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken});
  } catch (error) {
    // if (error.code === 11000) {
    //     // Duplicate key error
    //     return res.status(400).json({ error: 'Email already exists' });
    //   }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

})


///route 3  get user details api/auth/getuser  Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {

    const userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server eroor");

  }

})

module.exports = router