const scoreModel = require('../models').leaderboard;
const models = require('../models');
const checkQuery = require('../utils/queryString');

async function getScore(req, res) {
  let { page, pageSize, offset, sortBy = 'score', orderBy = 'DESC', id } = req.query;

  try {
    const score = await scoreModel.findAndCountAll({
      where: {
        ...(checkQuery(id) && {
          userId: id
        }),
      },
      include: [
        {
          model: models.user,
          require: true,
          as: 'player',
        },
      ],

      limit: pageSize,
      offset: offset,
      order: [[sortBy, orderBy]],
    });

    return res.json({
      status: 'Success',
      msg: 'score OK',
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: score.count,
      },
      data: score,
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

async function createScore(req, res) {
  try {
    const user = await scoreModel.findOne({
      where: {
        userId: req.id,
      },
    });
    if (user === null) {
      await scoreModel.create({
        userId: req.id,
        score,
      });
      return res.json({
        status: 'Success',
        msg: 'Score telah dibuat',
      });
    }

    await scoreModel.update(
      {
        score: user?.score + 1,
      },
      {
        where: {
          userId: req.id,
        },
      }
    );
    return res.json({
      status: 'Success',
      msg: 'Score telah diupdate',
    });
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      status: 'Fail',
      msg: err.message,
    });
  }
}

module.exports = { getScore, createScore };
