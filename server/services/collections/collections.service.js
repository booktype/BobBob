// Initializes the `collections` service on path `/collections`
const createService = require('feathers-mongoose');
const createModel = require('../../modelsMongo/collections.model');
const hooks = require('./collections.hooks');
const filters = require('./collections.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'collections',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/collections', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('collections');

  service.hooks(hooks);
  service.filter(filters)

  // service.filter(function(data,connection,hook){
  //   console.log(data)
  // });
};
