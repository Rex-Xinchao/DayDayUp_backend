const db = require("./db");

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
    (err) => err
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
      (dbRes) => res(dbRes, total),
      (err) => rej(err)
    );
  },
  getAcheById: (params, res, rej) => {
    let query = {
      sql: "SELECT * FROM wish where id = ?",
      timeout: 4000,
      values: [params.id],
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
  finish: (params, res, rej) => {
    let query = {
      sql: "UPDATE wish SET time = ? WHERE id = ?",
      timeout: 4000,
      values: [params.time, params.id],
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
};
