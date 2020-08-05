const express = require('express');
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authConfig = require('../../config/auth.json');
const multer = require('multer');
const multerConfig = require('../../config/multer');
const aws = require('aws-sdk');
const s3 = new aws.S3();
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

function gereteToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    })
}

router.post('/register', async (req, res) => {
    const { email, nickname } = req.body;
    try {

        if (await User.findOne({ nickname })) {
            return res.status(400).send({ error: "Este nickname já está em uso!" });
        }

        if (await User.findOne({ email })) {
            return res.status(400).send({ error: "Este email já está cadastrado!" });   
        }

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user });
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Registration Failed' });
    }

});

router.post('/uploadimage', multer(multerConfig).single('file'), async (req, res) => {

    if (req.file.path) {
        return res.send({ location: req.file.path, key: req.file.key });
    } else {
        return res.send({ location: req.file.location, key: req.file.key });
    }

});

router.put('/updateimage', async (req, res) => {
    const { id, urlImage, key } = req.body;
    
    if(process.env.STORAGE_TYPE === 'local'){
        await User.findByIdAndUpdate(id, { $set: { image: `${process.env.LOCALHOST}/files/${key}`, imageKey: key } });
    }else{
        await User.findByIdAndUpdate(id, { $set: { image: urlImage, imageKey: key } });
    }

    const user = await User.findById(id);

    return res.send({ user });

})
//Id é do usuario
router.delete('/deleteimage/:id', async (req, res) => {
    
    
    const user = await User.findById(req.params.id);
    
    try {      
        if (process.env.STORAGE_TYPE === 's3') {
            s3.deleteObject({
                Bucket: process.env.BUCKET_AWS,
                Key: user.imageKey
            }).promise();
        } else {
            promisify(fs.unlink)(path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', user.imageKey))
        }
        
        await User.findByIdAndUpdate(req.params.id, { $set: { image: '', imageKey: '' } });
        return res.send(true);
    } catch (error) {
        return res.status(400).send({error: "Não foi possivel deletar imagem"})
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');;
    try {

        if (!user) {
            return res.status(400).send({ error: "Este usuário não está cadastrado" });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).send({ error: "Email ou senha estão incorretos" });
        }

        user.password = undefined;

        return res.send({
            user,
            token: gereteToken({ id: user.id }),
        });


    } catch (error) {
        console.log(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        return res.send(user);
    } catch (error) {
        console.log(error);
    }
})

router.get('/all/adm', async (req,res)=>{
    try {
        const users = await User.find({type: 'adm'});
        return res.send(users);
    } catch (error) {
        console.log(error);
    }
})

router.put('/transform/adm', async (req,res)=>{
    const {id} = req.body;
    try {
        await User.findByIdAndUpdate(id, {$set:{type:"adm"}})
        const users = await User.find({type: 'adm'});
        return res.send(users);
    } catch (error) {
        
    }
})

router.put('/transform/user', async (req,res)=>{
    const {id} = req.body;
    try {
        await User.findByIdAndUpdate(id, {$set:{type:"user"}})
        const users = await User.find({type: 'user'});
        return res.send(users);
    } catch (error) {
        
    }
})

router.post('/all/users', async(req,res)=>{
    const {nickname} = req.body;
    try {
    const users = await User.find({nickname: {$regex: new RegExp(nickname), $options: 'i', $ne: "adm"}, type: "user"});
    
        return res.send(users);
    } catch (error) {
        console.log(error);
    }
})

module.exports = app => app.use('/user', router);