const fs = require('fs');
const express = require('express');
const Router = express.Router();

const { modelAccess } = require('../controller/modelAccess');

Router.post(`/salaryOCR`, modelAccess);

module.exports = Router;
