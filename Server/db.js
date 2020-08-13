var mongoose = require('mongoose');
// TODO: Change Database to ValueTube
mongoose.connect('mongodb+srv://ValueTube:3M60BDyt6Gm@valuetube.jnanb.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

console.log(mongoose.connection.readyState);