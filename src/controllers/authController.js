const { register, login } = require('../services/authService');

require('dotenv').config();

async function registerAuth(req, res) {
  let payload = req.body;
  let { password, username, country } = payload;

  register({ username, password, country, req, res })
    .then((result) => {
      // console.log('resultnya', result);
      // res.status(201).json({
      //   status: 'Success',
      //   msg: 'register successfully',
      // });
    })
    .catch((err) => {
      console.log(err)
      return res.status(403).json({
        status: 'Fail',
        msg: err.message,
      });
    });
}
async function loginAuth(req, res) {
  let payload = req.body;
  let { username, password } = payload;

  login({ username, password, req, res })
    .then((result) => {})
    .catch((err) => {
      console.log(err)
      return res.status(403).json({
        status: 'Fail',
        msg: err.message,
      });
    });
}

// async function authMe(req, res) {
//   try {
//     auth(req, res);
//   } catch (err) {
//     console.log(err)
//     res.status(403).json({
//       status: 'Fail',
//       msg: err.message,
//     });
//   }
// }

module.exports = { loginAuth, registerAuth };
