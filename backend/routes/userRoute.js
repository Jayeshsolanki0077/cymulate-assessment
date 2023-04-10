const express = require('express');
const router = express.router();

router.post('/register', (req,res) => {
    res.json({ message: 'Register the user'})
})

router.post('/login', (req,res) => {
    res.json({ message: 'log in user'})
})

router.post('/current', (req,res) => {
    res.json({ message: 'current pashe'})
})


module.exports = router;