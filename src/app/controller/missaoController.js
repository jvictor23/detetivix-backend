const express = require('express');
const Missao = require('../model/missao');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const User = require('../model/user');

// router.use(authMiddleware);

router.post('/create', async (req, res) => {
    try {
        const verificaMissao = await Missao.findOne({ ativa: true });

        if (verificaMissao) {
            return res.send({ error: "Alguma missao ainda está ativa!" });
        } else {
            const missao = await Missao.create(req.body);

            res.send({ missao });
        }


    } catch (error) {
        return res.status(400).send({ error: "Não foi possivel criar a missão!" })
    }
});

router.get('/authorization', async (req, res) => {
    res.send({ ok: true });
})

router.post('/', async (req, res) => {
    const { idUser } = req.body;
    try {
        const missao = await Missao.findOne({ ativa: true, listUser: { $in: [idUser] } })
        if (missao) {
            return res.send({ EstadoMissao: "Concluida" });
        } else {
            const missao = await Missao.findOne({ ativa: true });
            return res.send(missao);
        }
    } catch (error) {
        return res.status(400).send({ error: "Não foi possivel carregar a missao" });
    }
})

router.post('/verify', async (req, res) => {

    const { resposta, idMissao, idUser, valorMissao } = req.body;
    try {
        const missao = await Missao.findOne({ ativa: true, listUser: { $in: [idUser] } })
        if (missao) {
            return res.send({ error: "Você já respondeu esta missão!" })
        } else {

            const missao = await Missao.findById(idMissao).select("+resposta");
            if (missao.resposta === resposta.toUpperCase()) {
                await Missao.findByIdAndUpdate(idMissao, { $addToSet: { listUser: idUser }, $inc:{valor: -1} })
                const user = await User.findById(idUser);

                const soma = parseInt(user.score) + parseInt(valorMissao);

                await User.findByIdAndUpdate(idUser, {$set:{score: soma}});

                return res.send({ resposta: true })
            } else {
                return res.send({ resposta: false });
            }

        }



    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: "Não foi possivel verificar a resposta" });
    }

})

router.post('/close', async (req, res) => {
    try {
        await Missao.findOneAndUpdate({ ativa: true }, { $set: { ativa: false } });
        return res.send({ ok: true });
    } catch (error) {
        return res.status(400).send({ error: "Não foi possivel fechar a missão atual" });
    }
})

router.get('/ranking', async(req,res)=>{
    const ranking = await User.find({type: 'user', score: {$gt : 0}}).sort({score: 'descending'}).limit(10);
    return res.send(ranking);
})

module.exports = app => app.use('/missao', router);