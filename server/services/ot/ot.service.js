// Initializes the `ot` service on path `/ot`
const createService = require('feathers-nedb');
const createModel = require('../../models/ot.model');
const hooks = require('./ot.hooks');
const filters = require('./ot.filters');

module.exports = function () {
  const app = this;
  // app.service("ot")
  //   .before({
  //     create: [
  //       function(hook){
  //         return Promise.resolve(hook)
  //       }
  //     ]
  //   })
  //   .after({
  //     create: [
  //       function(hook){
  //         return Promise.resolve(hook)
  //       }
  //     ]
  //   })

  // const Model = createModel(app);
  // const paginate = app.get('paginate');
  //
  // const options = {
  //   name: 'ot',
  //   Model,
  //   paginate
  // };
  //
  // // Initialize our service with any options it requires
  class OTService {
    constructor(){
      this.events = ['join','leave', 'operation']
    }
    create(data) {
      console.log("create OT data",data)
      this.emit('join', data)
      // app.service('documents').get(data.document).then(function(doc){
      //   // console.log(doc)
      // })
    }
    update(doc_id, data){
      // console.log("operation", doc_id, data)
      this.emit('operation', {document: doc_id, data:data})
    }
    remove(doc_id) {
      this.emit('leave', doc_id)
    }
    setup(app) {
      this.app = app;
    }
  }
  app.use('/ot', new OTService());
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ot');

  service.hooks(hooks);
  service.filter('join', function(data,connection, hook){
    console.log("onjoin", data)
    console.log(connection)
    data.socketId = connection.socketId
    connection.document = data.document
    return data
  })
  service.filter('leave', function(doc_id,connection, hook){
    if(connection.document === doc_id){
      connection.document = ""
    }
    return false
  })
  service.filter('operation', function(data,connection, hook){
    if(data.document === connection.document){
      return data
    }
    return false
  })
  // service.filter(function (data, connection, hook) {
  //   // console.log(data,connection,hook)
  //   console.log(connection)
  //   return data;
  // });

};
