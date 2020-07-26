const express = require('express');
const app = express();
const cors = require('cors');

//database
require('./database');
//agregamoslos cors para que agregue las cabezeras para la comunucacion de servidores, para que se puedan comunuicar los servidores
app.use(cors());

//Nos permite usar json
app.use(express.json());
//agregamos el prfijo /api para todas nuestras rutas luego de localhost
app.use('/api',require('./routes/index'));





//port
app.listen(3000);
console.log('Server on port', 3000);
