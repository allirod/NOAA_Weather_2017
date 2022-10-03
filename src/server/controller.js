const express = require('express');
const path = require('path');
const Piscina = require('piscina');
const csvArray = require('../data/csvNames');

const controller = {};

// Create new worker thread pool
const piscina = new Piscina({
  filename: path.resolve(__dirname, 'worker.js'),
});

controller.getStationData = async (req, res, next) => {
  const { id } = req.params;
  const taskArray = [];

  csvArray.forEach((el) => {
    // schedule search of each csv data set for worker threads
    taskArray.push(piscina.run({ id, filePath: `./src/data/2017${el}.csv` }));
  });

  try {
    const dataArray = await Promise.all(taskArray);
    // remove one level of nesting from the dataArray
    const resultsArray = [];
    dataArray.forEach((el) => resultsArray.push(...el));
    res.locals.stationData = resultsArray;
    return next();
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

module.exports = controller;

