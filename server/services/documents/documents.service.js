// Initializes the `documents` service on path `/documents`
const createService = require('feathers-nedb');
const createModel = require('../../models/documents.model');
const hooks = require('./documents.hooks');
const filters = require('./documents.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'documents',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/documents', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('documents');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
