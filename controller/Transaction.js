const TransactionTypes = { credit: 'CREDIT', debt: 'DEBT' };
Object.freeze(TransactionTypes);
const Transaction = require("../model/Transaction");
const mongoose = require("mongoose");
const User = require("./User");
const getAllUserTransactions = (username) => {

    return new Promise((resolve, reject) => {
        Transaction.find({ UserName: username })
            .exec()
            .then((listOfTransaction) => {
                resolve(listOfTransaction);
            })
            .catch(err => {
                reject("Error while retrieving transactions for " + username)
            }
            )
    });
}
const addNewTransaction = (data) => {
    return new Promise((resolve, reject) => {
        let newTransaction = new Transaction(data);

        newTransaction.save(async (err) => {
            if (err) {
                reject(err);
            } else {

                getAllUserTransactions(data.UserName).then((list) => {
                    resolve(new Promise((resolve, reject) => resolve(User.updateBalance(list.map(transaction => transaction.Type === TransactionTypes.credit ? transaction.Amount : transaction.Amount * -1)
                        .reduce((a, b) => a + b), data.UserName))));
                }).catch(err => reject(err))



            }
        });
    });

}
const updateTransaction = (data) => new Promise(
    (resolve, reject) => Transaction
        .updateOne({ _id: data._id }, {
            $set: data,
        })
        .exec()
        .then((transaction) => resolve(`transaction ${data._id} updated for ${data.UserName}`))
        .catch((err) => reject(err))
)

module.exports = { getAllUserTransactions, addNewTransaction, updateTransaction };