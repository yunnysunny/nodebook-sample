var express = require('express');
var router = express.Router();


router.get('/user', function(req, res) {
  setTimeout(function() {
    console.log(noneExistVar.pp);
    res.send('respond with a resource');
  },0);  
});


module.exports = router;
