const express = require("express");
const {PORT, CONNECTION_STRING} = require("./src/config/index")
const cors = require("cors");
const dbConnect = require("./src/database/dbConnect")
const userRouter = require("./src/routes/userRoutes")
const app = express();

dbConnect(CONNECTION_STRING);

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("Hello World");
});

app.use('/api/user', userRouter);

app.listen(PORT, ()=>{
    console.log(`Listening at port no. ${PORT}`);
});