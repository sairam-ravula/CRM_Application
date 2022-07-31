/*
 * Defines the routes for user service
 */

const userController = require("../controllers/user.controller");

const { authJwt } = require("../middlewares");

module.exports = (app) => {
  // get 127.0.0.1:8081/crm/api/v1/users/
  app.get(
    "/crm/api/v1/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.findAllUsers
  );

  // get 127.0.0.1:8081/crm/api/v1/users/{id}
  app.get(
    "/crm/api/v1/users/:userID",
    [authJwt.verifyToken],
    userController.findUserbyID
  );

  // put 127.0.0.1:8081/crm/api/v1/users/{userID}
  app.put(
    "/crm/api/v1/users/:userID",
    [authJwt.verifyToken, authJwt.isAdmin],
    userController.updateUser
  );
};
