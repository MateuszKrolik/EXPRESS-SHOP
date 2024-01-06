const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db; //underscore means that this variable is private

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://mateuszkrolik87:1I9UbNZqMksVzkNk@cluster0.gdjmk4f.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db(); //this will keep running
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  //method returning access to db if it exists
  if (_db) {
    //if it's set/not undefined
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
