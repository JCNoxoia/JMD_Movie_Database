const mongoose = require('mongoose');
const models = require('./models.js');
const movies = models.movie;
const users = models.user;

const express = require('express'),
    morgan = require('morgan');

const app = express();


mongoose.connect('mongodb://localhost:27017/jmdDB');

//body-parser middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Server logging
app.use(morgan('common'));

//CREATE requests
app.post('/users', async (req, res) => {
    await users.findOne({username: req.body.username})
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.username + ' already exists.');
            } else {
              users
                .create({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    dob: req.body.dob
                })
                .then((user) => {res.status(201).json(user)})
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.post('/users/:username/:title', async (req, res) => {
    await movies.findOne({title: req.params.title})
        .then((movie) => {
            users.updateOne(
            {username: req.params.username},
            {$push: {favMovies: movie._id}}
        )})
        .then((user) => {
            res.status(201).send('Successfully added ' + req.params.title + ' to ' + user.username + '\'s favorites list.')
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//RETRIEVE requests:
app.get('/', (req, res) => res.send('Welcome to the JMD Movie Database.'));

app.get('/movies', async (req, res) => {
    await movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/movies/:title', async (req, res) => {
    await movies.findOne({title: req.params.title})
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/genres/:genreName', async (req, res) => {
    await movies.findOne({'genre.name': req.params.genreName})
        .then((movies) => {
            res.status(200).json(movies.genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/directors/:directorName', async (req, res) => {
    await movies.findOne({'director.name': req.params.directorName})
        .then((movies) => {
            res.status(200).json(movies.director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//UPDATE requests:
app.put('/users/:username', async (req, res) => {
    await users.findOneAndUpdate(
        {username: req.params.username},
        {$set: {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            dob: req.body.dob
        }})
        .then((user) => {
            res.status(200).send(user.username + '\'s account successfully updated.')
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//DELETE requests:
app.delete('/users/:username/:title', async (req, res) => {
    await users.findOneAndUpdate(
        {username: req.params.username},
        {$pull: {favMovies: req.params.title}}
    )
    .then((user) => {
        res.status(200).send(req.params.title + ' has been successfully removed from ' + user.username + '\'s favorites list.')
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.delete('/users/:username', async (req, res) => {
    await users.deleteOne({username: req.params.username})
        .then((user) => {
            if (!user) {
                res.status(400).send('User was not found.');
            } else {
                res.status(200).send('User successfully deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});


//Public static file serving
app.use(express.static('public'));

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong...');
});

//Run app
app.listen(8080, () => console.log('App is listening on Port 8080.'));