const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authConfig = require('../../config/auth.json')

function gereteToken(params={}){
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async(req,res)=>{
    const {email, nickname} = req.body;
    try {

        if(await User.findOne({nickname})){
            return res.status(400).send({error: "Este nickname já está em uso!"});
        }

        if(await User.findOne({email})){
            return res.status(400).send({error: "Este email já está cadastrado!"});
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({user});
    } catch (error) {
        console.log(error)
        return res.status(400).send({error: 'Registration Failed'});
    }
    
});


router.post('/authenticate', async (req,res)=>{
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');;
    try {
        
        if(!user){
            return res.status(400).send({error: "Este usuário não está cadastrado"});
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send({error: "Email ou senha estão incorretos"});
        }

        user.password = undefined;

        return res.send({
            user, 
            token: gereteToken({id: user.id}),
        });
        
        
    } catch (error) {
        console.log(error);
    }
})

module.exports = app => app.use('/user', router);