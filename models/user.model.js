/*
  This file will hold the schema for user resource
*/

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  /*
   * name, userID, password, email, createdAt, updatedAt,
   * userType [Admin | Engineer | Customer],
   * userStatus [Approvrd | Pending | Rejected]
   */
  name: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => {
      return Date.now();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return Date.now();
    },
  },
  userType: {
    type: String,
    required: true,
    default: "CUSTOMER",
  },
  userStatus: {
    type: String,
    requried: true,
    default: "APPROVED",
  },
  ticketsCreated: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Ticket",
  },
  ticketsAssigned: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Ticket",
  },
});

module.exports = mongoose.model("User", userSchema);
