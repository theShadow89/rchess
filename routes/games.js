var express = require('express');
var router = express.Router();

var GameController = require("../controllers/game");

router.post('/create', GameController.create);

router.put('/move/:id', GameController.move);

router.get('/status/:id', GameController.status);

router.delete('/delete/:id', GameController.delete);

router.get('/', GameController.list);

module.exports = router;