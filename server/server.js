var level = require('level')
var autobahn = require('autobahn')


var connection = new autobahn.Connection({
   url: "ws://127.0.0.1:8080/ws",
   realm: "documentapp"
});
var db = level('./documentapp')

function getDocument(args){
  var name = args[0]
  console.log("request doc ", name)
  var d = new autobahn.when.defer();
  db.get(name, function(err, value){
    if(value){
      console.log(value)
      d.resolve(JSON.parse(value))
    }else{
      d.resolve()
    }

  })
  return d.promise;
}
function saveDocument(args){
  console.log("saveDocument", args)
  var name = args[0]
  var doc = args[1]
  db.put(name, JSON.stringify(doc))
  return true;
}

function patchDocument(name, property, patch){
  db.get(name, function(err,value){

  })
  var currentContent = this.content[property]
  var schema = this.schema[property]
  var start = patch[0]
  var end = patch[1]
  var patch = patch[2]
  if(end> currentContent.length){
    var changedFragment = currentContent.slice(start)
  }else{
    var changedFragment = currentContent.slice(start,end)
  }
  changedFragment = [].concat.apply([],changedFragment.map(function(i){return [].slice.call(i)}))
  var buffers = []
  for(var i in patch){
    var value = patch[i]
    if(typeof value === 'object'){
      buffers = buffers.concat(value)
    }else if(value>0){
      keep = changedFragment.slice(0, value)
      buffers = buffers.concat(keep)
      changedFragment = changedFragment.slice(value)
    }else if(value<0){
      changedFragment = changedFragment.slice(-value)
    }
  }
  var doc = this
  console.log(buffers)
  var encodedFragment = buffers.reduce(function(newFragment,item){
    if(item === 150){
      console.log(newFragment)
      newFragment.push([150])
    }else{
      newFragment[newFragment.length-1].push(item)
    }
    return newFragment
  },[])
  return currentContent
    .slice(0,start)
    .concat(encodedFragment)
    .concat(
      currentContent.slice(end)
    )
}
function patchDocument([name, patch]){

  // var buffers = []
  // db.get(name, function(err,value){
  //   var processedObj = value.split(',')
  //   for(var i in patch){
  //     var value = patch[i]
  //     if(typeof value === 'object'){
  //       buffers.push(value.data)
  //
  //     }else if(value>0){
  //       keep = processedObj.slice(0, value)
  //       buffers.push(keep)
  //       processedObj = processedObj.slice(value)
  //     }else if(value<0){
  //       processedObj = processedObj.slice(-value)
  //     }
  //   }
  //   db.put(name, [].concat(buffers),function(err){
  //     console.log(err)
  //   })
  // })
}
connection.onopen = function (session, details) {
   // Publish, Subscribe, Call and Register
   console.log("server connected")
  //  function collabDocument(args){
  //    var name = args[0]
  //    session.subscribe(name, function(patch){patchDocument(name, patch)})
  //  }
   function patchedDocument(args){
     console.log("patch", args)
     setTimeout(function(){
        session.publish(args[0], [args[1]])
     },20)
     return true
   }
   session.register('document.get',getDocument)
   session.register('document.save',saveDocument)
   session.register('document.patch',patchedDocument)
};


connection.onclose = function (reason, details) {
   // handle connection lost
   console.log(reason,details)
}
connection.open()
