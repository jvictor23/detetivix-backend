require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
// var corsOptions = {
//     origin: 'https://detetivix.com.br/',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }
app.use(cors());
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

require('./app/controller/userController')(app);
require('./app/controller/projectController')(app);
require('./app/controller/missaoController')(app);
require('./app/controller/admController')(app);



app.listen(process.env.PORT || 4000);


