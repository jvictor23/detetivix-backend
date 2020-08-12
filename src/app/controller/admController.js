const express = require('express');
const User = require('../model/user');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/authorization/:id', async (req, res)=>{
    
    const id = req.params.id;
    try {
        const user = await User.findById(id).select("+type");
        if(user.type !== 'adm'){
            return res.send({authorization: false})
        }else{
            return res.send({authorization: true})
        }

    } catch (error) {
        res.status(400).send({error: "Erro ao autorizar adm"});
    }
})


module.exports = app => app.use('/adm', router);

