const express = require('./config/express');
const {logger} = require('./config/winston');

const PORT = 3000;
express().listen(PORT);
logger.info(`Server listening on port ${PORT}`);