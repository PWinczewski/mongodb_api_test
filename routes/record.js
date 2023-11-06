const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js");
const ObjectId = require("mongodb").ObjectId;


recordRoutes.route("./record.js").get(function(reg,res){
    let db_connect = dbo.getDb("testdb")
    db_connect.collection("restaurants").find({}).toArray(function(err, result){
        if (err) throw err;
        res.json(result);
    })
})

module.exports = recordRoutes;