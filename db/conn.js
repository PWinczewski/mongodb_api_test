const {MongoClient} = require("mongodb");
const Db = process.env.MONGO_URI;
console.log(Db)
const client = new MongoClient(Db, {

})

var _db;

module.exports = {
    connectToServer: function(callback) {
        client.connect(function(err, db){
            if (db){
                _db = db.db("warehouse");
                console.log("Connected to mongoDB");
            }
            return callback(err);
        });
    },
    getDb: function(){
        return _db
    },
};