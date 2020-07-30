const db = require("./db");
const utils = require("../lib/utils");
const userModel = require("./user");
// 获取list的total值
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
    (err) => 0
  );
};
// 获取list已完成成就的total值
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
    (err) => 0
  );
};
// 根据id获取成就
const getAche = (params) => {
  let query = {
    sql: "SELECT * FROM achievement where id = ?",
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
      (dbRes) =>
        res({
          total: total,
          finished: finished,
          list: utils.underlineToCamelCase(dbRes),
        }),
      (err) => rej(err)
    );
  },
  finish: async (params, res, rej) => {
    const ache = await getAche(params);
    if (!ache) {
      rej("成就不存在");
      return
    } else if (ache.finished == 1) {
      rej("成就不能重复完成");
      return
    }
    ache.finished = '1'
    let query = {
      sql: "UPDATE achievement SET finished = '1' WHERE id = ?",
      timeout: 4000,
      values: [params.id],
    };
    db.row(query).then(
      (dbRes) => {
        let userParams = {
          ...ache,
          calc: "add",
          refresh: "ache",
          openid: params.openid,
        };
        userModel.setPoint(
          userParams,
          (dbRes) => res(ache),
          (err) => rej(err)
        );
      },
      (err) => rej(err)
    );
  },
};
