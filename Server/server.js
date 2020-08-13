var app = require('./app');
var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

/* TODO:
  To ensure we have a useable demo we need to set up ways for 
  the API to interact with the neural network. 
  
  To achieve this we must:
  1. Ensure the Neural Network and API is hosted. 
    (We can get away with the API being hosted on Luke's server 
    but I believe we need to host the network that emulates a production deployment.
    I recommend looking into heroku.)
  2. Look into running multiple chains of middleware so the API can handle requests to the database and network.
*/