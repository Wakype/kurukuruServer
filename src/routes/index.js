const express = require('express');
const paginationMiddleware = require('../middlewares/paginationMiddleware');
const {
  jwtValidateMiddleware,
} = require('../middlewares/jwtValidateMiddleware');
const { loginAuth, registerAuth } = require('../controllers/authController');
const { getScore, createScore } = require('../controllers/scoreController');

const routers = express.Router();

routers.post('/login', loginAuth);
routers.post('/register', registerAuth);

routers.get('/getScore', getScore);

routers.use(jwtValidateMiddleware);
routers.use(paginationMiddleware);

routers.post('/createScore', createScore);

module.exports = routers;
