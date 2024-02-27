
const express = require('express');
const { searchMovie } = require('../controllers/movieController');

const router = express.Router();

router.get('/', searchMovie);

module.exports = router;
