const express = require('express');
const Joi = require('joi');
const logger = require('./logger');

const app = express();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port ' + port));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));

app.use(logger)

const genres = [{
        id: 1,
        name: 'Comedy'
    }, {
        id: 2,
        name: 'Horror'
    },
    {
        id: 3,
        name: 'Sci-fi'
    },
    {
        id: 4,
        name: 'Thriller'
    },
    {
        id: 5,
        name: 'Drama'
    }
];

function validateInput(input) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(input, schema);
}

function find(array, id) {
    return array.find(a => a.id === parseInt(id));
}

app.get('/api/genres', (req, res) => {
    res.send(genres);
})

app.get('/api/genres/:id', (req, res) => {
    const genre = find(genres, req.params.id);

    if (!genre) res.status(404).send('Genre not found!');
    res.send(genre);
})

app.post('/api/genres', (req, res) => {
    const {
        error
    } = validateInput(req.body);

    const genre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(genres);
    res.send(genre);
})

app.put('/api/genres/:id', (req, res) => {
    const genre = find(genres, req.params.id);

    if (!genre) res.status(400).send('Genre not found!');

    const result = validateInput(req.body);
    const {
        error
    } = validateInput(req.body);

    if (error) {
        res.status(404).send(error.details[0].message);
        return;
    }

    genre.name = req.body.name;
    res.send(genre);
})

app.delete('/api/genres/:id', (req, res) => {
    const genre = find(genres, req.params.id);
    if (!genre) res.status(400).send('Genre not found!');

    const index = genres.indexOf(genre);

    genres.splice(index, 1);

    res.send(genre);
})