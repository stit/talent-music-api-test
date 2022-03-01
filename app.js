require ('dotenv').config()

const express =require('express')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const app = express()

app.use(express.json())

const User = require('./models/User')

//Rota Publica
app.get('/', (req, res) => {
    res.status(200).json({ msg: 'Bem vindo a nossa API'})
})

//Registrar Usuario
app.post('/auth/register', async (req, res) => {

    const {email, password} = req.body

    if(!email) {
        return res.status(422).json({ msg: 'o email é obrigatorio!'})
    }
    if(!password) {
        return res.status(422).json({ msg: 'a senha é obrigatorio!'})
    }

// checar se o usuario existencia
    const userExists = await User.findOne({ email: email})

    if(userExists) {
        return res.status(422).json({ msg: 'Por favor, utilize outro e-mail'})
    }

//criar senha
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

//Criar usuario
    const user = new User({
        email,
        password: passwordHash,
    })

    try {
        await user.save()

        res.status(201).json({msg: "Criado"})
        
    }catch(error){
        console.log(error)
        res.status(500).json({msg: 'Erro no servidor'})
    }

    

})

//Cria login
app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body

    if(!email) {
        return res.status(422).json({ msg: 'o email é obrigatorio!'})
    }
    if(!password) {
        return res.status(422).json({ msg: 'a senha é obrigatorio!'})
    }

    // checar se o usuario existe
    const user = await User.findOne({ email: email})

    if(!user) {
        return res.status(404).json({ msg: 'Usuario nao encontrado'})
    }

    //checar se a senha existe
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword) {
        return res.status(422).json({ msg: 'Senha é invalida!'})
    }

    try {
        const secret = process.env.SECRET

        const token = jwt.sign(
            {
            id: user.id,
            },
            secret,
        )

        res.status(200).json({token})
        
    }catch(error){
        console.log(error)
        res.status(500).json({msg: 'Erro no servidor'})
    }
})


//Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS
//Congig Mongodb
mongoose
    .connect(
        `mongodb+srv://${dbUser}:${dbPassword}@cluster0.f1u0l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )
    .then(() => {
    app.listen(8080)
    console.log("conectou ao banco")
}).catch((err) => console.log(err))


