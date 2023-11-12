const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn.js");
const ObjectId = require("mongodb").ObjectId;


recordRoutes.route("/products").get(function(req,res){
    let db_connect = dbo.getDb("warehouse")
    db_connect.collection("products").find({}).toArray(function(err, result){
        if (err) throw err;
        res.json(result);
    })
})

recordRoutes.route("/products/raport/count").get(function(req,res){
    let db_connect = dbo.getDb("warehouse")
    let pipeline = [
        { $match: {} },
        { $group: { _id: null, productCount: { $sum: 1 } } },
        { $project: { _id: 0 } }
    ];
    db_connect.collection("products").aggregate(pipeline).toArray(function(err, result){
        if (err) throw err;
        res.json(result);
    })
})


recordRoutes.route("/products/raport/sumValue").get(function(req,res){
    let db_connect = dbo.getDb("warehouse")
    let pipeline = [
        { $match: {} },
        { $project: { productValue: { $multiply: ["$price", "$amount"] } } },
        { $group: { _id: null, totalProductValue: { $sum: "$productValue" } } },
        { $project: { _id: 0 } }
    ];
    db_connect.collection("products").aggregate(pipeline).toArray(function(err, result){
        if (err) throw err;
        res.json(result);
    })
})



recordRoutes.route("/products/:id").put(function(req,res){
    let db_connect = dbo.getDb("warehouse")
    let myquery = {_id: ObjectId(req.params.id)}

    let newValues = {
        $set: {
            name: req.body.name,
            price: req.body.price,
            amount: req.body.amount,
            measureUnit: req.body.measureUnit
        }
    }
    db_connect.collection("products").updateOne(myquery, newValues, function(err, result){
        if (err) throw err;
        res.json(result);
    })
})

recordRoutes.route("/products/:id").delete(function(req,res){
    let db_connect = dbo.getDb("warehouse")
    let myquery = {_id: ObjectId(req.params.id)}
    db_connect.collection("products").find({"_id": myquery}).toArray(function(err, result){
        if (err) throw err;
        if (result.length === 0) res.json("Nie istnieje");
        else {
            db_connect.collection("products").deleteOne(myquery, function(err, result){
                if (err) throw err;
                res.json(result);
            })
        }
    })
})

recordRoutes.route("/products/add").post(function(req,response){
    let db_connect = dbo.getDb();
    let myobj={
        name: req.body.name,
        price: req.body.price,
        amount: req.body.amount,
        measureUnit: req.body.measureUnit
    }
    db_connect.collection("products").find({"name": myobj.name}).toArray(function(err, result){
        if (err) throw err;
        if (result.length !== 0) response.json("Name already exists");
        else {
            db_connect.collection("products").insertOne(myobj, function(err, res){
                if (err) throw err;
                response.json(res);
            });
        }
    })
})

module.exports = recordRoutes;