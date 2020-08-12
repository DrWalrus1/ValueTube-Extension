var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ValueTube:3M60BDyt6Gm@valuetube.jnanb.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true });

console.log(mongoose.connection.readyState);