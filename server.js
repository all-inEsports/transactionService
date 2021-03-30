require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors")
const mongoose = require("mongoose")
const TransactionController = require("./controller/Transaction")();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());

app.post('/v1/new/transaction',
    (req,res)=> TransactionController
        .addNewTransaction(req.body)
        .then((msg)=> res.json(msg))
        .catch((err)=>res.json(err))
);

app.get('/v1/transaction/:userName', 
    (req,res)=> TransactionController
    .getAllUserTransactions(req.params.userName)
    .then((transactions) => res.json(transactions))
    .catch((err)=> res.json(err))
);

app.put('/v1/update/transaction/:id',
    (req,res)=> TransactionController.updateTransaction(req.body)
    .then((msg)=> res.json(msg))
    .catch((err)=>res.json(err))
);

 // Connection to db and defines User model
 const connect = (mongoDBConnectionString) => {
    return new Promise(function (resolve, reject) {
      let db = mongoose.createConnection(mongoDBConnectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      db.on("error", (err) => {
        reject(err);
      });

      db.once("open", () => {
        resolve();
      });
    });
  }

  connect(process.env.URI)
    .then(() => {
      app.listen(port, () => {
        console.log("API listening on: " + port);
      });
    })
    .catch((err) => {
      console.log("unable to start the server: " + err);
      process.exit();
    });