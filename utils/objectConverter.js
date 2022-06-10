/*
 * This file will have the logic to transfrom the object
 */

exports.userResponse = (users) => {
  usersResponse = [];

  users.forEach((user) => {
    usersResponse.push({
      name: user.name,
      userID: user.userID,
      email: user.email,
      userType: user.userType,
      userStatus: user.userStatus,
    });
  });
  return usersResponse;
};

exports.ticketResponse = (ticket) => {
  return {
    title: ticket.title,
    description: ticket.description,
    ticketPriority: ticket.ticketPriority,
    status: ticket.status,
    reporter: ticket.reporter,
    assignee: ticket.assignee,
    id: ticket._id,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
  };
};
