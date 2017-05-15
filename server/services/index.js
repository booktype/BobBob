const messages = require('./messages/messages.service.js');
const collections = require('./collections/collections.service.js');
const documents = require('./documents/documents.service.js');
const users = require('./users/users.service.js');
const ot = require('./ot/ot.service.js')
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(messages);
  app.configure(collections);
  app.configure(documents);
  app.configure(users);
  app.configure(ot)
};
