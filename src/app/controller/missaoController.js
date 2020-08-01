const express = require('express');
const Missao = require('../model/missao');
const router = express.Router();

router.post('/create', async (req,res)=>{
   const missao = await Missao.create(req.body);

   res.send({missao});
});

router.post('/verify', async (req,res)=>{

    const {resposta, id} = req.body;
    try {
        const  missao = await Missao.findById(id);
        if(missao.resposta === resposta){
            return res.send({resposta: true})
        }else{
            return res.send({resposta: false});
        }

        
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: "Não foi possivel verificar a resposta"});
    }

    return res.send({ok: true})

})

module.exports = app => app.use('/missao', router);