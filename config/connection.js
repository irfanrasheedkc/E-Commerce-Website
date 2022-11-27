// const mongoClient = require('mongodb').MongoClient


// const state={
//     db:null
// }

// module.exports.connect = function(done){
//     const url='mongodb://0.0.0.0:27017';
//     const dbname = 'shopping';

//     mongoClient.connect(url , (err , data)=>{
//         if(err) 
//             return done(err);
//         state.db = data.db(dbname);
//         done();
//     })

   
// }

// module.exports.get = function(){
//     return state.db;
// }



// const client = new MongoClient(uri, { useNewUrlParser: true });

const state={
    db:null
}

module.exports.connect = function(done){
    // const url='mongodb://0.0.0.0:27017';
  const dbname = 'shopping';
  const MongoClient = require('mongodb').MongoClient
//   const mongo_username = process.env.MONGO_USERNAME
//   const mongo_password = process.env.MONGO_PASSWORD

const mongo_username="irfanrasheedkc"
const mongo_password="Irfan2003"

  const uri = `mongodb+srv://${mongo_username}:${mongo_password}@cluster0.ewdoj2g.mongodb.net/shopping?retryWrites=true&w=majority`;

    MongoClient.connect(uri , (err , data)=>{
        if(err) 
            return done(err);
        state.db = data.db(dbname);
        done();
    })

   
}

module.exports.get = function(){
    return state.db;
}