require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

require('./app/controller/userController')(app);
require('./app/controller/projectController')(app);
require('./app/controller/missaoController')(app);

app.listen(4000);


