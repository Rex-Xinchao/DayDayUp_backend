const db = require("./db");
const utils = require("../lib/utils");
const userModel = require("./user");

const getTotalCount = (params) => {
  let sql = `SELECT COUNT(*) AS TOTAL FROM wish where userId = ?`;
  let values = [params.openid];
  let query = {
    sql: sql,
    timeout: 4000,
    values: values,
  };
  return db.row(query).then(
    (dbRes) => dbRes[0]["TOTAL"],
    (err) => 0
  );
};

const getWish = (params) => {
  let query = {
    sql: "SELECT * FROM wish where id = ?",
    timeout: 4000,
    values: [params.id],
  };
  return db.row(query).then(
    (dbRes) => utils.underlineToCamelCase(dbRes)[0],
    (err) => null
  );
};

module.exports = {
  getList: async (params, res, rej) => {
    const total = await getTotalCount(params);
    params.current = Number(params.current);
    params.pageSize = Number(params.pageSize);
    let query = {
      sql: "SELECT * FROM wish where userId = ? limit ?,?",
      timeout: 4000,
      values: [
        params.openid,
        params.current * params.pageSize,
        params.pageSize,
      ],
    };
    db.row(query).then(
      (dbRes) => res({ total: total, list: utils.underlineToCamelCase(dbRes) }),
      (err) => rej(err)
    );
  },
  finish: async (params, res, rej) => {
    const wish = await getWish(params);
    if (!wish) {
      rej("愿望不存在");
      return;
    }
    wish.time += 1;
    let query = {
      sql: "UPDATE wish SET time = ? WHERE id = ?",
      timeout: 4000,
      values: [wish.time, params.id],
    };
    db.row(query).then(
      (dbRes) => {
        let userParams = {
          ...wish,
          calc: "remove",
          refresh: "wish",
          openid: params.openid,
        };
        userModel.setPoint(
          userParams,
          (dbRes) => res(wish),
          (err) => rej(err)
        );
      },
      (err) => rej(err)
    );
  },
};
