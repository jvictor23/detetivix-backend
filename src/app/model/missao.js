const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const MissaoSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: true
    },

    resposta:{
        type: String,
        required: true
    },

    ativa:{
        type: Boolean,
        default: true
    },

    createdAt:{
        type: Date,
        default: Date.now
    }
});

/*MissaoSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.resposta,10);
    this.resposta = hash;

    next();
});*/

const missao = mongoose.model('Missao', MissaoSchema);

module.exports = missao;