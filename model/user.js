const db = require("./db");
const utils = require("../lib/utils");
const logModel = require("./log");
const findUser = (params) => {
  let query = {
    sql: `SELECT * FROM user where id = ?`,
    timeout: 4000,
    values: [params.openid],
  };
  return db.row(query).then(
    (dbRes) => dbRes,
    (err) => err
  );
};
module.exports = {
  getInfo: async (params, res, rej) => {
    let user = await findUser(params);
    user = utils.underlineToCamelCase(user)[0];
    if (user) {
      res(user);
    } else {
      let query = {
        sql: "INSERT INTO user(id, point) VALUE (? ,?)",
        timeout: 4000,
        values: [params.openid, 0],
      };
      db.row(query).then(
        (dbRes) => res({ id: params.openid, point: 0 }),
        (err) => rej(err)
      );
    }
  },
  setPoint: async (params, res, rej) => {
    let user = await findUser(params);
    user = utils.underlineToCamelCase(user)[0];
    let point = user.point;
    if (params.calc === "add") {
      point = Number(point) + Number(params.point);
    } else {
      point = Number(point) - Number(params.point);
      if (point < 0) {
        rej("点数不足");
        return
      }
    }
    let query = {
      sql: "UPDATE user SET point = ? WHERE id = ?",
      timeout: 4000,
      values: [point, params.openid],
    };
    db.row(query).then(
      (dbRes) => {
        logModel.addLog(
          params,
          (dbRes) => res({ id: params.openid, point: 0 }),
          (err) => rej(err)
        );
      },
      (err) => rej(err)
    );
  },
};
