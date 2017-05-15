module.exports = function (data, connection, hook) { // eslint-disable-line no-unused-vars
  // console.log(connection.user._id,data.ownerID,data.collaborators,hook.data)
  if(
    connection.user._id === data.ownerID || data.collaborators.includes(connection.user._id)
  ){
    return data;
  }
  return false
};
