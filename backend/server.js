const express = require('express');
const cors = require('cors')
const bcrypt = require('bcrypt')
const colors = require('colors')
const morgan = require ('morgan')
const dotenv = require('dotenv');
const mySqlPool = require('./config/db');



dotenv.config()



const app = express();

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

app.use("/api/v1/accounttbl", require("./routes/accountsRoutes"))
app.use("/api/v1/reservationttbl", require("./routes/reservationRoutes"));

app.use((req, res, next) => {
    if (req.method === 'POST') {
        console.log('🔵 Incoming POST to:', req.path);
        console.log('🔵 Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

app.get('/test', (req,res ) =>{
    res.status(200).send('HEllo world');
})

const PORT = process.env.PORT || 8000

mySqlPool
.query('SELECT 1')
.then(()=> {

    console.log('MySQL DB Connected'.bgYellow.white)

    app.listen(PORT, () =>{
    console.log(`Server Running on port ${process.env.PORT}`.bgBlack.white);
  });

})
.catch((error) =>{
     console.log(error);
})
