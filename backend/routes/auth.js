const express = require('express');
const User = require('../models/User')
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'Rajeshisagoodboy'

// ROUTE 1:  create a user using: POST "/api/auth/createuser" no login required
router.post('/createuser',[
  body('name','Enter valid name').isLength({min: 3}),
  body('email', 'Enter valid Email').isEmail(),
  body('password','password must be 5 char').isLength({min: 5})],

  async (req, res)=>{
    let success = false;
//if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({success, errors: errors.array()});
  }

  try{
    //check whether  the user with this email exists already
  let user = await User.findOne({email: req.body.email});
  if(user){
    return res.status(400).json({success, error: "sorry a user with this email already exists"})
  }

  const salt =  await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
// create a new user
  user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
  });

  const data = {
    user: {
      id: user.id
    }
  }
  const authtoken =  jwt.sign(data, JWT_SECRET);
  // res.json(user)
  success = true;
  res.json({success, authtoken})

} catch(error){
  console.log(error.message);
  res.status(500).send("internal server error");
}
})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login" no login required
router.post('/login',[
  body('email', 'Enter valid Email').isEmail(),
  body('password','password cannot be blank').exists()],

  async(req, res) =>{
    let success= false
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()});
    }

    const {email, password}= req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        success = false
        return res.status(400).json({error: "please try to login with correct credentials"});
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if(!passwordcompare){
        success = false;
        return res.status(400).json({success, error: "please try to login with correct credentials"});
      }
      const data = {
        user: {
          id: user.id
        }
      }
      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({success, authtoken})
    }
    catch(error){
      console.log(error.message);
      res.status(500).send("Internal server error");
    }
  })

  // ROUTE 3: Get loggedin user details: POST "api/auth/getuser". Login required
  router.post('/getuser', fetchuser, async (req, res) => {
      try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
      } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server Error");
      }
    })

module.exports = router;