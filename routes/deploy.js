var express = require('express');
var router = express.Router();

// router.all('/', function(req, res, next) {
//     console.log(req);
//     console.log("done")
// })

/* GET home page. */
router.post('/', function(req, res, next) {
    //todo add logic for handling deployment
    let form = req.body;
    console.log('filled in form: ');
    console.log(form);
    if (form.type === "Employer") {
        if (form.reward === "") {
            res.send('invalid reward');
            return;
        }
    } else {

    }
    console.log(req.body)

    res.render('deploy');
});

router.get('/', function(req, res, next) {
    console.log(req.body)

    res.render('deploy')
});

module.exports = router;
