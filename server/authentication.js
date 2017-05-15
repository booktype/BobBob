const authentication = require('feathers-authentication');
const jwt = require('feathers-authentication-jwt');
const local = require('feathers-authentication-local');
const { populate } = require('feathers-hooks-common');


module.exports = function () {
  const app = this;
  const config = app.get('authentication');
  console.log(config)
  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local(config.local));

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        populate({
          schema: {
            include: [{
              service: 'users',
              nameAs: 'user',
              parentField: 'ownerID',
              childField: '_id'
            }]
          }
        })
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      all: [

      ]
    }
  });
};
