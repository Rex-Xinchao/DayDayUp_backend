const db = require("./db");
const getTotalCount = (params) => {
  let sql = `SELECT COUNT(*) AS TOTAL FROM achievement where ${
    params.type === "all" ? "" : "type = ? and"
  } userId = ?`;
  let values = [params.openid];
  if (params.type !== "all") {
    values = [params.type].concat(values);
  }
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

const getFinishedCount = (params) => {
  let sql = `SELECT COUNT(*) AS TOTAL FROM achievement where ${
    params.type === "all" ? "" : "type = ? and"
  } userId = ? and finished = '1'`;
  let values = [params.openid];
  if (params.type !== "all") {
    values = [params.type].concat(values);
  }
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
    const finished = await getFinishedCount(params);
    params.current = Number(params.current);
    params.pageSize = Number(params.pageSize);
    let sql = `SELECT * FROM achievement where ${
      params.type === "all" ? "" : "type = ? and"
    } userId = ? limit ?,?`;
    let values = [
      params.openid,
      params.current * params.pageSize,
      params.pageSize,
    ];
    if (params.type !== "all") {
      values = [params.type].concat(values);
    }
    let query = {
      sql: sql,
      timeout: 4000,
      values: values,
    };
    db.row(query).then(
      (dbRes) => res(dbRes, total, finished),
      (err) => rej(err)
    );
  },
  getAcheById: (params, res, rej) => {
    let query = {
      sql: "SELECT * FROM achievement where id = ?",
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
      sql: "UPDATE achievement SET finished = '1' WHERE id = ?",
      timeout: 4000,
      values: [params.id],
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
};
