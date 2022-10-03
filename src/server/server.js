const express = require('express');
const path = require('path');

const controller = require('./controller');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// load static files
app.use('/dist', express.static(path.join(__dirname, '../../dist')));
app.use(express.static(path.join(__dirname, '../../public')));

app.use('/api/:id', controller.getStationData, (req, res) => {
  res.status(200).json(res.locals.stationData);
});
// handle unknown end points
app.use((req, res) => res.status(404).json('Page Not Found'));
// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Unkown middleware error.',
    status: 500,
    message: { error: 'Unknown middleware error' },
  };
  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Server listening on ${port}`));

module.exports = app;
