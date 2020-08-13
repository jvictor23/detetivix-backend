const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL_UMBLER, {useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
mongoose.Promise = global.Promise;

module.exports = mongoose;
