const express = require('express');
const Missao = require('../model/missao');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/create', async (req,res)=>{
   const missao = await Missao.create(req.body);

   res.send({missao});
});

router.get('/authorization', async (req,res)=>{
    res.send({ok: true});
})

router.post('/', async(req, res)=>{
    const {idUser} = req.body;
    try {
        const missao = await Missao.findOne({ativa:true, listUser: {$in: [idUser]}})
        if(missao){
            return res.send({EstadoMissao: "Concluida"});
        }else{
        const missao = await Missao.findOne({ativa: true});
        return res.send(missao);
        }
    } catch (error) {
        return res.status(400).send({error: "Não foi possivel carregar a missao"});
    }
})

router.post('/verify', async (req,res)=>{

    const {resposta, idMissao, idUser} = req.body;
    
    try {
        const  missao = await Missao.findById(idMissao).select("+resposta");
        if(missao.resposta === resposta){
            await Missao.findByIdAndUpdate(idMissao, {$addToSet:{listUser: idUser}})
            return res.send({resposta: true})
        }else{
            return res.send({resposta: false});
        }

        
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: "Não foi possivel verificar a resposta"});
    }

})

router.post('/close', async(req,res)=>{
    try {
        await Missao.findOneAndUpdate({ativa: true},{$set:{ativa: false}});
        return res.send({ok: true});
    } catch (error) {
        return res.status(400).send({error: "Não foi possivel fechar a missão atual"});
    }
})

module.exports = app => app.use('/missao', router);