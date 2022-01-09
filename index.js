const express = require('express');
const app = express();
const parkings = require('./parkings.json');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const jwt = require('jsonwebtoken');
require('dotenv').config();
console.log('secret is', process.env.ACCESS_TOKEN_SECRET);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));


//authentification du user
const user = {
    id: 42,
    name: 'inconnu',
    email: 'inconnu@gmail.com',
    admin: true,
};

//Generation du token et expiration
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'});
}
//Generation du refresh token et expiration
function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '1y'});
}
  

//Requete post pour generer l'identification
app.post('/api/login', (req, res) => {

    
    if (req.body.email !== user.email) {
      res.status(401).send('invalid credentials');
      return ;
    }
    if (req.body.password !== 'cuillere') {
      res.status(401).send('invalid credentials');
      return ;
    }
    const accessToken = generateAccessToken(user);
    console.log('accessToken', accessToken);
    const refreshToken = generateRefreshToken(user);
    res.send({
        accessToken,
        refreshToken,
    });
});

//Requete post pour generer le refresh token
app.post('/api/refreshToken', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      
      delete user.iat;
      delete user.exp;
      const refreshedToken = generateAccessToken(user);
      res.send({
        accessToken: refreshedToken,
      });
    });
});


//Generer l'authentification token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
}
//Requete get pour chercher le token
app.get('/api/me', authenticateToken, (req, res) => {
    res.send(req.user);
});


//Initialisation du swagger qui sera plus bas
const swaggerOptions={
    definition:{
        openapi:'3.0.0',
        info:{
            title:'Employee Management API',
            version:'1.0.0',
            description:'Employe Api for employee management',
            servers:["http://localhost:8080"]
        }
    },
    apis:["index.js"]
}

const swaggerDocs=swaggerJSDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocs));







app.use(express.json())
//Requete get pour regarder les données dans le json
app.get('/parkings', authenticateToken, (req,res) => {
    res.status(200).json(parkings)
})
//Requete get id pour regarder les données dans le json
app.get('/parkings/:id', authenticateToken, (req,res) => {
    const id = parseInt(req.params.id)
    const parking = parkings.find(parking => parking.id === id)
    res.status(200).json(parking)
})
//Requete post pour que l'utilisateur poste un message
app.post('/parkings', authenticateToken, (req,res) => {
    parkings.push(req.body)
    res.status(200).json(parkings)
})
//Requete put pour que l'utilisateur modifie un message
app.put('/parkings/:id', authenticateToken, (req,res) => {
    const id = parseInt(req.params.id)
    let parking = parkings.find(parking => parking.id === id)
    parking.name =req.body.name,
    parking.city =req.body.city,
    parking.type =req.body.type,
    res.status(200).json(parking)
})
//Requete post pour que l'utilisateur supprime un message
app.delete('/parkings/:id', authenticateToken, (req,res) => {
    const id = parseInt(req.params.id)
    let parking = parkings.find(parking => parking.id === id)
    parkings.splice(parkings.indexOf(parking),1)
    res.status(200).json(parkings)
})


app.listen(8080, () => {
    console.log("Serveur à l'écoute")
})






//Rappel le token est verifier, tant que le token n'est pas renseigné, aucune requetes sera prises en compte
/**
 * @swagger
 * /parkings:
 *   get:
 *     summary: Il va chercher le contenu
 *     tags: [Requetes]
 *     responses:
 *       200:
 *         description: Il va chercher le contenu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '/parkings/:id'
 */

/**
 * @swagger
 * '/parkings/:id':
 *   get:
 *     summary: Il va chercher le dans l'id
 *     tags: [Requetes]
 *     responses:
 *       200:
 *         description: Il va chercher le dans l'id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '/parkings/:id'
 */



/**
 * @swagger
 * '/parkings':
 *   post:
 *     summary: Il va aller poster un message
 *     tags: [Requetes]
 *     responses:
 *       200:
 *         description: Il va aller poster un message
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '/parkings'
 */



/**
 * @swagger
 * '/parkings/:id':
 *   put:
 *     summary: Il va modifier un message
 *     tags: [Requetes]
 *     responses:
 *       200:
 *         description: Il va aller poster un message
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '/parkings/:id'
 */


/**
 * @swagger
 * '/parkings/:id':
 *   delete:
 *     summary: Il va supprimer un message
 *     tags: [Requetes]
 *     responses:
 *       200:
 *         description: Il va supprimer un message
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '/parkings/:id'
 */






