'use strict';

const { authenticate } = require('feathers-authentication').hooks;
const { populate } = require('feathers-hooks-common');
const processCollection = require('../../hooks/process-collection');
const processQuery = require('../../hooks/process-collection-query')
module.exports = {
  before: {
    all: [
      authenticate('jwt'),
    ],
    find: [processQuery()],
    get: [processQuery()],
    create: [ processCollection() ],
    update: [ processCollection() ],
    patch: [ processCollection() ],
    remove: [processCollection()]
  },

  after: {
    all: [
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
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
