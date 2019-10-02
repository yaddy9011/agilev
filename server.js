const express = require('express');  
const app = express();  
app.use(express.static(__dirname + '/dist/front'));  
app.all('*', (req, res) => {  
  res.status(200).sendFile(__dirname + '/dist/front/index.html');  
});  
app.listen(process.env.PORT || 8080);
console.log('App escuchando');

