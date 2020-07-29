const db = require("./db");
const utils = require("../lib/utils");

const getTotalCount = (params) => {
  let sql = `SELECT COUNT(*) AS TOTAL FROM log where userId = ?`;
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
      sql: "SELECT * FROM log where userId = ? order by id desc limit ?,?",
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
  addLog: (params, res, rej) => {
    let time = utils.getNowFormatDate();
    let query = {
      sql:
        "INSERT INTO log(type, name, point, updateTime, calc, userId) VALUE (? ,?, ?, ?, ?, ?)",
      timeout: 4000,
      values: [
        params.refresh,
        params.name,
        params.point,
        time,
        params.calc,
        params.openid,
      ],
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
};
