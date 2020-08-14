const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL_UMBLER, {useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
.then(res=>{
    console.log("Banco mongodb conectado");
});
mongoose.Promise = global.Promise;

module.exports = mongoose;
