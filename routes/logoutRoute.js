const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).send('Could not log out, please try again.');
        } else {
            res.clearCookie('connect.sid');
            res.redirect('/login');
        }
    });
});

module.exports = router;
