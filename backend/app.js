const express = require('express');
const app = express();
const multer  = require('multer');
const upload = multer();
const path = require('path');
const jwt = require('jsonwebtoken');
const { expressjwt: xpJwt } = require("express-jwt");
const PORT = 3000;

let frenchMovies = [];


// to service static files from the public folder
app.use('/public', express.static('public'));

const secret = 'dzegrKJUFdrgr23215gergerg311131gregqrg86EreFqrgghf';

app.use(
  xpJwt({
    secret: secret,
    algorithms: ["HS256"],
  }).unless({ path: ['/', '/movies', new RegExp('/movies.*/', 'i'), '/movie-search', '/login', new RegExp('/movie-details.*/', 'i')]}));
//toutes les pages ont une protection avec token sauf le GET login

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/movies', (req, res) => {

    const title = 'Films français des trente dernières années';

    const frenchMovies = [
        { title: 'La fabuleux destin', year: 2001 },
        { title: 'Buffet froid', year: 1979 },
        { title: 'Le diner de cons', year: 1998 },
        { title: 'De rouille et d\'os', year: 2012 }
    ];
    res.render('movies', { movies: frenchMovies, title: title });
});

app.post('/movies', upload.fields([]), (req, res) => {
    if(!req.body) {
        return res.sendStatus(500);
    } else {
    const formData = req.body;
    console.log('formData: ', formData);
    const newMovie = { title : req.body.movietitle, year: req.body.movieyear };
    frenchMovies = [...frenchMovies, newMovie];
    res.sendStatus(201);
    }
});

app.use(express.urlencoded({ extended: false }));

// Attention à l'ordre des routes qui aura un impact. Les routes spécialisées doivent être avant les routes plus génériques.
app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    let title = req.params.title;
    //res.send(`film numéro ${id}`);
    res.render('movie-details', { movieid: id, movietitle: title });
});

app.get('/', (req, res) => {
    //res.send('Hello World!');
    //Utiliser render pour renvoyer un template
    res.render('index'); 
});

app.get('/login', (req,res) => {
    res.render('login', {title : 'Espace membre'})
})

const fakeUser = {email: 'test@test.fr', password: 'test'};


app.post('/login', (req,res) => {
    console.log('login post', req.body);
    if(!req.body) {
        res.sendStatus(500);
    } else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({iss: 'http://expressmovies.fr', user: 'Sam', role: 'moderator'}, secret);
            res.json(myToken);
        } else {
            res.sendStatus(401)
        }
    }
});

app.get('/movie-search', (req,res) => {
    res.render('movie-search');
})

app.use(express.json());

app.get('/member-only', (req,res) => {
    console.log('req.user', req.user)
})

app.listen(3000, () => {
    console.log(`listening on port ${PORT}`);
});