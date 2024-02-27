const axios = require('axios');
const API_KEY = '222d703d41cd2377eb918d3061915d75';
const User = require('../models/userModel');
const Movie = require('../models/movieModel');

const saveMovieDataToHistory = async (userId, movieId) => {
    try {
        await User.findByIdAndUpdate(userId, {
            $push: { 
              history: { 
                type: 'Movie', 
                refId: movieId
              } 
            }
        });
    } catch (error) {
        console.error("Error updating user history with movie data:", error);
    }
};

exports.searchMovie = async (req, res) => {
    try {
        const movieName = req.query.movieName || 'Avatar';
        const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`);
        const movieData = movieResponse.data.results[0];

        let movie;

        const existingMovie = await Movie.findOne({ movieName: movieName });
        if(existingMovie) { 
            existingMovie.title = movieData[0].title;
            existingMovie.date = movieData[0].release_date;
            existingMovie.rating = movieData[0].vote_average;
            existingMovie.img = movieData[0].poster_path;
            await existingMovie.save();
            movie = existingMovie;
        } else {
            movie = await Movie.create({
                title: movieData.title,
                date: movieData.release_date,
                rating: movieData.vote_average,
                img: movieData.poster_path,
            });
        }

        const userId = req.session.userId;
        const user = await User.findById(userId);

        await saveMovieDataToHistory(userId, movie._id);

        var time = new Date();
        const formattedTime = `${time.getHours()}:${time.getMinutes()}`;
        res.render('main', { movieData: movieData, user: user });
    } catch (error) {
        console.error('Error fetching movie information:', error);
        res.status(500).send('Error fetching movie information');
    }
};
