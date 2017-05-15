module.exports = function(){
  return function(hook){
    if(!hook.params.user){
      return Promise.resolve(hook)
    }
    hook.params.query.$or = [
      {
        collaborators: hook.params.user._id
      },
      {ownerID: hook.params.user._id}
    ]
    return Promise.resolve(hook)
  }
}
