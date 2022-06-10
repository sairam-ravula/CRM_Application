/*
 *Version v1 - Anyone should be able to create a ticket
 */

const User = require("../models/user.model");
const constants = require("../utils/constants");
const Ticket = require("../models/ticket.model");
const ObjectConverter = require("../utils/objectConverter");

exports.createTicket = async (req, res) => {
  //* Logic to create the ticket
  const ticketObject = {
    title: req.body.title,
    ticketPriority: req.body.ticketPriority,
    description: req.body.description,
  };
  /*
   * check If any engineer is available
   */
  try {
    const engineer = await User.findOne({
      userType: constants.userType.engineer,
      userStatus: constants.userStatus.approved,
    });
    if (engineer) {
      ticketObject.assignee = engineer.userID;
    }

    const ticket = await Ticket.create(ticketObject);
    /*
     * Ticket is created now
     * 1. We need to update customer and engineer document
     */

    //* Find out the customer and update
    if (ticket) {
      const user = await User.findOne({
        userID: req.userID,
      });
      user.ticketsCreated.push(ticket._id);
      await user.save();

      /*
       * Update the engineer
       */
      engineer.ticketsAssigned.push(ticket._id);
      await engineer.save();
    }
    return res.status(201).send(ObjectConverter.ticketResponse(ticket));
  } catch (err) {
    console.log(err.message);
    return res.status(501).send({
      message: "Some internal error",
    });
  }
};
