const moment = require("moment");
let publicRoom = [];
let privateRoom = [];
module.exports.Chatbot = (message) => {
  return {
    name: "anonymousBot",
    message,
    avatar: "https://avatars.dicebear.com/api/bottts/mad.svg",
    time: moment().format("ddd, hA"),
  };
};
module.exports.addToPublicRoom = ({ id, username, avatar }) => {
  publicRoom.push({
    username,
    avatar,
    id,
  });
};
module.exports.addToPrivateRoom = ({ id, username, avatar }) => {
  publicRoom.push({
    username,
    avatar,
    id,
  });
};
module.exports.message = ({ username, avatar, message }) => {
  return {
    name: username,
    message: message,
    avatar: avatar,
    time: moment().format("ddd, hA"),
  };
};
module.exports.handleDisconnect = (id) => {
  let userFound = false;
  let username = "";
  let room = "public";
  let avatar = "https://avatars.dicebear.com/api/bottts/mad.svg";
  let name = "anonymousBot";
  publicRoom.forEach((value, index) => {
    if (value.id === id) {
      userFound = true;
      username = value.username;
      publicRoom.splice(index, 1);
    }
  });
  if (!userFound) {
    privateRoom.forEach((value) => {
      if (value.id === id) {
        username = value.username;
      }
    });
  }
  return {
    name,
    message: `${username} left the chat.`,
    room,
    avatar,
    time: moment().format("ddd, hA"),
  };
};
module.exports.getCurrentUsers = () => {
  return publicRoom;
};
