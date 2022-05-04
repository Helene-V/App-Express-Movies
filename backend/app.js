const express = require('express');
const app = express();

const PORT = 3000;

app.get('/movies', (req, res) => {
    res.send('Bientôt des films ici même');
});

// Attention à l'ordre des routes qui aura un impact. Les routes spécialisées doivent être avant les routes plus génériques.
app.get('/movies/add', (req, res) => {
    res.send('prochainement, un formulaire d\'ajout ici');
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    res.send(`film numéro ${id}`);
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log(`listening on port ${PORT}`);
});