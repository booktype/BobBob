
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const collection = new mongooseClient.Schema({
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    description: {
      type: String
    },
    collaborators: {
      type: Array,
      default: []
    },
    ownerID: {
      type: String,
      required: [true, "owner missing"]
    },
    toc: {
      type: Array
    },
    createdAt: { type: Date, 'default': Date.now },
    updatedAt: { type: Date, 'default': Date.now }
  });

  return mongooseClient.model('collection', collection);
};
