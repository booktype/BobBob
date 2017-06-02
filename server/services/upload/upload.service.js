// Initializes the `users` service on path `/users`
const hooks = require('./upload.hooks');
// const filters = require('./users.filters');
const multer = require('multer');
const multipartMiddleware = multer();
const blobService = require('feathers-blob');
const fs = require('fs-blob-store');
const blobStorage = fs(__dirname + '/uploads');
module.exports = function () {
  const app = this;
  // Initialize our service with any options it requires
  app.use('/upload',

    // multer parses the file named 'uri'.
    // Without extra params the data is
    // temporarely kept in memory
    multipartMiddleware.single('uri'),

    // another middleware, this time to
    // transfer the received file to feathers
    function(req,res,next){
        req.feathers.file = req.file;
        next();
    },
    blobService({Model: blobStorage})
);
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload');
  service.hooks(hooks);
};
