const express = require('express'),
    morgan = require('morgan')

const app = express();

let topMovies = [
    {
        title: 'Stardust',
        releaseYear: '2007',
        director: 'Matthew Vaughn',
        genres: ['romance', 'fantasy', 'adventure']
    },
    {
        title: 'Howl\'s Moving Castle',
        releaseYear: '2004',
        director: 'Hayao Miyazaki',
        genres: ['anime', 'fantasy', 'adventure']
    },
    {
        title: 'Hot Fuzz',
        releaseYear: '2007',
        director: 'Edgar Wright',
        genres: ['action', 'comedy']
    },
    {
        title: 'The Mask',
        releaseYear: '1994',
        director: 'Chuck Russell',
        genres: ['comedy']
    },
    {
        title: 'Django Unchained',
        releaseYear: '2012',
        director: 'Quentin Tarantino',
        genres: ['action', 'western']
    },
    {
        title: 'Spirited Away',
        releaseYear: '2001',
        director: 'Hayao Miyazaki',
        genres: ['anime', 'fantasy', 'adventure']
    },
    {
        title: 'Idiocracy',
        releaseYear: '2006',
        director: 'Mike Judge',
        genres: ['Comedy']
    },
    {
        title: 'Monty Python and The Holy Grail',
        releaseYear: '1975',
        director: 'Terry Gilliam & Terry Jones',
        genres: ['adventure', 'fantasy', 'comedy']
    },
    {
        title: 'The Thing',
        releaseYear: '1982',
        director: 'John Carpenter',
        genres: ['Horror', 'Thriller']
    },
    {
        title: 'Get Smart',
        releaseYear: '2008',
        director: 'Peter Segal',
        genres: ['action', 'comedy']
    }
];

//Server logging
app.use(morgan('common'));

//GET requests:
app.get('/movies', (req, res) => res.json(topMovies));

app.get('/', (req, res) => res.send('Welcome to the JMD Movie Database.'));

//Public static file serving
app.use(express.static('public'));

//Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong...');
});

app.listen(8080, () => console.log('App is listening on Port 8080.'));