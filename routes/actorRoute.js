
const express = require('express');
const { searchActor } = require('../controllers/actorController');

const router = express.Router();

router.get('/', searchActor);

module.exports = router;
