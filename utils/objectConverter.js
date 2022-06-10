/*
* This file will have the logic to transfrom the object
*/

exports.userResponse = (users) => {
    usersResponse = [];
    
    users.forEach(user => {
        usersResponse.push({
            name : user.name,
            userID : user.userID,
            email : user.email,
            userType : user.userType,
            userStatus : user.userStatus
        });
    });
    return usersResponse;
}