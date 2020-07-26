const {Router} = require('express');
const router = Router();
//Todo esta en un solo archivo; pero lo recomendable es usar varios archivos
const User = require('../model/user');

const jwt = require('jsonwebtoken');

//await para el proceso asincrono, requiere que la function sea async
//Register-obtenemos el token del usuario
router.post('/signup',async(req, res)=>{
    const {email, password} = req.body;
    // console.log(email,password);
    const newUser = new User({email,password});
    // console.log(newUser);
    await newUser.save();
    // res.send('register now');
    //creamos un tokken le asignamos la palabra secretKey
    const token = jwt.sign({_id:newUser._id},'secretkey')
    //devolvemos el tokjen al cliente
    res.status(200).json({token})


})
//Loguearse - Devolvemos un token al usuario
router.post('/signin',async(req, res) => {
    //recibimos uj correo y un pássword
    const {email, password} = req.body;
    //buscamos por corre
    const user = await User.findOne({email})
    //Validaciones
    //usuario no logeado
    if(!user) return res.status(401).send("The email doesn't exits");
    //verificacion de contraseña
    if(user.password !== password) return res.status(401).send("wrong password");
    //Validacion correcta devolvemos un token
    const token = jwt.sign({_id:user._id},'secretkey');
    //devolvemos el status
    return res.status(200).json({token});

});
//Ruta para devolver datos Get devuelve datos publicos
router.get('/tasks',(req, res) =>{
    res.json([
        {
            "_id" : 1,
            "email" : 'Task ones',
            "description" : 'lorem ipsun',
            "date" : "2020-05-21T12:47:39.087Z"
            
        },
        {
            "_id" : 2,
            "email" : 'Task two',
            "description" : 'lorem ipsun',
            "date" : "2020-05-21T12:47:39.087Z"
           
        },
        {
            "_id" : 3,
            "email" : 'Task three',
            "description" : 'lorem ipsun',
            "date" : "2020-05-21T12:47:39.087Z"
        },
    ])
});
//Devolver datos privados necesita loguearse
//usamos la function verifyToken
router.get('/private-tasks',verifyToken,(req,res)=>{
    res.json([
        {
            "_id" : 1,
            "email" : 'Task ones private',
            "description" : 'lorem ipsun',
            "date" : "2020-05-21T12:47:39.087Z"
            
        },
        {
            "_id" : 2,
            "email" : 'Task two private',
            "description" : 'lorem ipsun',
            "date" : "2020-05-21T12:47:39.087Z"
           
        },
        {
            "_id" : 3,
            "email" : 'Task three private',
            "description" : 'lorem ipsun',
            "date" : "2020-05-21T12:47:39.087Z"
        },
    ])
});

router.get('/profile',verifyToken,(req,res)=>{
    //Respondemos con el id
    res.send(req.userId);
})



//probando si funciona el (req,res)=>{}
// router.get('/',(req,res) => res.send('Hello world'))

module.exports = router;

function verifyToken(req, res, next) {
    //viendo la authorization
    // console.log(req.headers.authorization);
    //Validando la authorization

    if(!req.headers.authorization) {
         return res.status(401).send('anUthorize Request');
     }
     //dividimos el token en dos partes, cada que halla un espacio
     const token= req.headers.authorization.split(' ')[1]
     //Comprobamos si no esta vacio
     if(token === 'null') {
         return res.status(401).send('anUthorize Request');
     }

     const payload = jwt.verify(token, 'secretkey')
    //  console.log(payload);
    //Solo guardamos el _id
    //Devolvemos los datos private-tasks si estanmos autorizados
    req.userId = payload._id;
    next();
    
}

//funcion para validar, para no estar validando en cada get