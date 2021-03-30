const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose
    .connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((error) => {
        console.error("Connection to DB Failed");
        console.error(error.message);
        process.exit(-1);
    });


const TransactionSchema = new Schema({
    UserName: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    Amount: {
        type: Number,
        required: true,
    },
    Type:{
        type: String,
        required: true
    },
    Description:{
        type: String,
        required: true
    }
});

// exporting the module
module.exports = mongoose.connection.model("Transactions", TransactionSchema);
