
const User = require('../models/user.model');

const objectConverter = require('../utils/objectConverter');
/*
  * Fetch the list of all users
  * only admin is allowed to call this method
  * admin should be able to filter based on
  * 1. Name
  * 2. UserType
  * 3. UserStatus
*/

exports.findAllUsers = async (req, res) => {


  /*
  * Filtering the users based on name, userType and userStatus - only by admin
  * Read the data from the query params
  */

  const nameReq = req.query.name;
  const userStatusReq = req.query.userStatus;
  const userTypeReq = req.query.userType;
  const mongoQueryObj = {}
  if (nameReq && userStatusReq && userTypeReq) {
    mongoQueryObj.name = nameReq;
    mongoQueryObj.userStatus = userStatusReq;
    mongoQueryObj.userType = userTypeReq;
  }
  else if(nameReq && userStatusReq) {
    mongoQueryObj.name = nameReq;
    mongoQueryObj.userStatus = userStatusReq;
  }
  else if (userStatusReq && userTypeReq) {
    mongoQueryObj.userStatus = userStatusReq;
    mongoQueryObj.userType = userTypeReq;
  }
  else if (nameReq && userTypeReq) {
    mongoQueryObj.name = nameReq;
    mongoQueryObj.userType = userTypeReq;
  }
  else if (nameReq){
    mongoQueryObj.name = nameReq;
  }
  else if (userStatusReq){
    mongoQueryObj.userStatus = userStatusReq;
  }
  else if (userTypeReq) {
    mongoQueryObj.userType = userTypeReq;
  }
  /*
  * Fetch the user documents from the usersDB
  */
  try {
    const users = await User.find(mongoQueryObj);
    return res.status(200).send(objectConverter.userResponse(users));
  } catch (err){
    console.log(err.message);
    return res.status(500).send({
      message : "internal error while fetching the users."
    });
  }
  
}

/*
  * Fetch the user based on User ID
*/
exports.findUserbyID = async (req, res) => {
  const userIdReq = req.params.userID;
  const user = await User.find({userID : userIdReq});
  if (user){
    return res.status(200).send(objectConverter.userResponse(user));
  }
  else {
    return res.status(200).send({
      message : "User with userID " + userIdReq + " is not found"
    });
  }

}

/* 
 * Update the userStatus and UserType
 * - Only admin can perform this 
*/

exports.updateUser = (req, res) => {
  
  try{
    const userIdReq = req.params.userID;
  const user = User.findOneAndUpdate({
    userID : userIdReq
  },{
    name : req.body.name,
    userStatus : req.body.userStatus,
    userType : req.body.userType
  }).exec();
  res.status(200).send({
    message : "User details updated succesfully"
  });
  } catch (err) {
    console.log(err.message);
    res.status(500).send({
      message : "Internal server error while updating the user"
    });
  }

}
