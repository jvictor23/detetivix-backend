require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

require('./app/controller/userController')(app);
require('./app/controller/projectController')(app);
require('./app/controller/missaoController')(app);

app.listen(4000);


