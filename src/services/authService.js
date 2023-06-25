const UserModel = require('../models').user;
const models = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sequelize } = require('../models');

async function register({ username, password, country, req, res }) {
  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await UserModel.findOne({
      where: {
        username: username,
      },
    });
    if (user === null) {
      await UserModel.create({
        username: username,
        password: hashPassword,
        country: country,
      });

      return res.status(201).json({
        status: 'Success',
        msg: 'register successfully',
      });
    }
    return res.status(404).json({
      status: 'Fail',
      msg: 'Username tidak ditemukan silahkan register',
    });
  } catch (error) {
    throw error;
  }
}

async function login({ username, password, req, res }) {
  try {
    const user = await UserModel.findOne({
      where: {
        username: username,
      },
      include: [
        {
          model: models.leaderboard,
          require: true,
          as: 'player',
        },
      ],
    });

    if (user === null) {
      return res.status(404).json({
        status: 'Fail',
        msg: 'Username tidak ditemukan silahkan register',
      });
    }
    if (password === null) {
      return res.status(404).json({
        status: 'Fail',
        msg: 'Username & Password tidak dicocok',
      });
    }

    const verify = await bcrypt.compareSync(password, user?.password);

    if (!verify) {
      return res.status(404).json({
        status: 'Fail',
        msg: 'Username & Password tidak dicocok',
      });
    }
    const token = jwt.sign(
      {
        id: user?.id,
        username: user?.username,
        country: user?.country,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    return res.json({
      status: 'Success',
      msg: 'successfully login',
      token: token,
      user: user,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// async function auth(req, res) {
//   try {
//     let username = req.username;

//     const user = await UserModel.findOne({
//       where: {
//         username: username,
//       },
//     });

//     if (user !== undefined) {
//       if (user === null) {
//         return res.status(404).json({
//           status: 'Fail',
//           msg: 'Username tidak ditemukan',
//         });
//       }

//       const token = jwt.sign(
//         {
//           id: req?.id,
//           username: user?.username,
//         },
//         process.env.JWT_SECRET,
//         {
//           expiresIn: '7d',
//         }
//       );
//       res.json({
//         status: 'Success',
//         msg: 'successfully login',
//         token: token,
//         user: user,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// }

module.exports = {
  register,
  login,
  // auth,
};
