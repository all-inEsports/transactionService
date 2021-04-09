const TransactionTypes = { credit: 'CREDIT', debt: 'DEBT' };
Object.freeze(TransactionTypes);

const mongoose = require("mongoose");
const User = require("./User");

module.exports = () => {

    const Transaction = require("../model/Transaction");
    return {
        getAllUserTransactions: (username) => new Promise((resolve, reject) => Transaction.find({ UserName: username })
            .exec()
            .then((listOfTransaction) => resolve(listOfTransaction))
            .catch(err => reject("Error while retrieving transactions for " + username)))
        ,
        addNewTransaction: (data) => {
            return new Promise((resolve, reject) => {
                let newTransaction = new Transaction(data);

                newTransaction.save((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        let value = getAllUserTransactions(data.UserName)
                        .map(transaction => transaction.Type === TransactionTypes.credit?transaction.Amount :transaction.Amount*-1 )
                        .reduce((a,b)=>a+b);
                        resolve(new Promise((resolve, reject) => resolve(User.updateBalance(value,data.UserName))));
                        
                    }
                });
            });

        }
        ,
        updateTransaction: (data) => new promise(
            (resolve, reject) => Transaction
                .updateOne({ _id: data._id }, {
                    $set: data,
                })
                .exec()
                .then((transaction) => resolve(`transaction ${data._id} updated for ${data.UserName}`))
                .catch((err) => reject(err))
        )



    }
};