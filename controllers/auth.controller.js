
const bcrypt = require('bcryptjs');

const constants = require('../utils/constants'); 

const User = require('../models/user.model');

const jwt = require('jsonwebtoken');

const config = require('../configs/auth.config');
/*
   * Controller for registration
*/
exports.signup = async (req, res) => {
    
    var userStatus = req.body.userStatus;

    if(!req.body.userStatus){
        if (!req.body.userType || req.body.userType == constants.userType.customer){
            userStatus = constants.userStatus.approved;
        }
        else {
            userStatus = constants.userStatus.pending;
        }
    }
    

    const userObj = {
        name : req.body.name,
        userID : req.body.userID,
        email : req.body.email,
        userType :  req.body.userType,
        password : bcrypt.hashSync(req.body.password, 8),
        userStatus : userStatus
    }
    /*
    Insert new user into DB
    */
   try{
   const userCreated = await User.create(userObj);
   console.log("User created", userCreated);

   /*
     * Return the response
   */
  const userResponse = {
      name : userCreated.name,
      email : userCreated.email,
      userID : userCreated.userID,
      userType : userCreated.userType,
      userStatus : userCreated.userStatus,
      createdAt : userCreated.createdAt,
      updatedAt : userCreated.updatedAt
  }

  res.status(201).send(userResponse);
} catch (err) {
    console.log('Unable to register new user', err.message);
    res.status(500).send({
        message : "Some internal error while inserting new user"
    })
}
}

/*
* Controller for signin/login
*/

exports.signin = async (req, res) => {
    try {
    var user = await User.findOne({userID : req.body.userID});
    } catch (err) {
        console.log("unable to login", err.message);
    }

    if (user == null){
        return res.status(400).send({
            message : "Failed! UserID doesn't exist"
        });
    }

    //check if password is valid or not
    if (user.userStatus != constants.userStatus.approved)
    {
        return res.status(200).send({
            message : "Can't able to login as the user is not yet approved"
        });
    }
    
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if(!isPasswordValid){
        return res.status(401).send({
            message : "Invalid password"
        });
    }

    //successful login
    // need to generate access token
    const token = jwt.sign({id: user.userID},config.secret, {expiresIn: 600});

    res.status(200).send({
        name : user.name,
        userID : user.userID,
        email : user.email,
        userType : user.userType,
        userStatus : user.userStatus,
        accessToken : token
    });

}
