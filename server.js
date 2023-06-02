const express = require("express");
const app = express();
const connectDb = require("./config/dbConnection")
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const port = process.env.PORT;
app.use(express.json());

connectDb();
// first routes is the folder name, second is the file name
app.use("/api/example", require("./routes/routes"))
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server Run on ${port} `)
})
