'use strict';

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function() {
  return function(hook) {
    // The authenticated user
    const user = hook.params.user;
    // The actual message text
    // Override the original data
    hook.data.userId = user._id
    hook.data.createdAt = new Date().getTime()
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    return Promise.resolve(hook);
  };
};
