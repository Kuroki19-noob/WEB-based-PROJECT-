const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables immediately
dotenv.config();

const mySqlPool = require('./config/db');

const app = express();
const frontendPath = path.join(__dirname, '..', 'Frontend');
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(frontendPath));

app.use("/api/v1/accounts", require("./routes/accountsRoutes"));
app.use("/api/v1/reservations", require("./routes/reservationRoutes"));

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        success: false,
        message: err.message
    });
});

app.get('/test', (req,res ) =>{
    res.status(200).send('Hello world');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

mySqlPool
.query('SELECT 1')
.then(()=> {
    console.log('MySQL DB Connected'.bgYellow.white);

    app.listen(PORT, () =>{
        console.log(`Server Running on port ${PORT}`.bgBlack.white);
    });
})
.catch((error) =>{
     console.log(error);
})
