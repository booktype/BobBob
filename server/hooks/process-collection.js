'use strict';

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function() {
  return function(hook) {
    // The authenticated user
    const user = hook.params.user;
    // The actual message text
    // Override the original data
    console.log(hook.method, "................................")
    switch(hook.method){
      case "create":
        hook.data.ownerID = user._id
        hook.data.collaborators = []
        hook.data.createdAt = new Date().getTime()
        return Promise.resolve(hook)
      case "update":
      case "patch":
      case "remove":
        return hook.service.get(hook.id).then(function(collection){
          if(hook.method === "update"){
            if(collection.ownerID!=user._id){
              throw new Error("Only the owner is allowed to update the collection")
            }else{
              return Promise.resolve(hook)
            }
          }
          if(hook.method === "remove"){
            if(collection.ownerID!=user._id){
              throw new Error("Only the owner is allowed to remove the collection")
            }else{
              return Promise.resolve(hook)
            }
          }
          if(
            collection.ownerID!=user._id &&
            (hook.data.collaborators || hook.data.ownerID)
          ){
            throw new Error("Only the owner is allowed to add or remove collaborators or change the ownership")
          }else if(
             collection.collaborators.includes(user._id) ||
             collection.ownerID === user._id
           ){
            return Promise.resolve(hook)
          }else{
            throw new Error("You are not allowed to change the collection")
          }
        })
    }
  };
};
