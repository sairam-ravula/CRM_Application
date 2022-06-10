// This file contains all the custom middleware for validating the request body

const User = require('../models/user.model');
const constant = require('../utils/constants');

verifySignUpRequest = async (req, res, next) => {

    if(!req.body.name){
        return res.status(400).send({
            message : "Failed! Username is not provided."
        });
    }

    if(!req.body.password){
        return res.status(400).send({
            message : "Failed! Password is not provided."
        });
    }

    if(!req.body.email){
        return res.status(400).send({
            message : "Failed! email is not provided."
        });
    }
    const mail = await User.findOne({email : req.body.email});
    if (mail != null){
        return res.status(400).send({
            message : "Failed! Email ID already exists."
        })
    }

    const userType = req.body.userType
    const userTypes = [constant.userType.admin, constant.userType.customer, constant.userType.engineer]

    if (userType && !userTypes.includes(userType)){
        return res.status(400).send({
            message : "Failed! userType is not correctly provided."
        });
    }
    if (!req.body.userID){
        return res.status(400).send({
            message : "Failed! userID is not provided."
        });
    }

    // if userID already exists
    const user = await User.findOne({userID : req.body.userID});
    if(user!= null){
        return res.status(400).send({
            message : "UserID already exists"
        });
    }

    next();
}

module.exports = {
    verifySignUpRequest : verifySignUpRequest
};