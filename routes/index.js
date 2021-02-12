var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'TruCol' });
});

router.get('/hunter', function(req, res, next) {
  res.render('hunter', { title: 'TruCol' });
})

router.get('/client', function(req, res, next) {
  res.render('client', { title: 'TruCol' });
})

module.exports = router;
