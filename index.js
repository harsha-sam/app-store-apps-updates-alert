const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api', apiRoutes)

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/form.html'));
});
app.listen(4000, () => {
  console.log('listening on port 4000');
});
