const db = require("./db");
module.exports = {
  getList: (params, res, rej) => {
    let query = {
      sql: "SELECT * FROM task where userId = ?",
      timeout: 4000,
      values: [params.openid]
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
  update: (params, res, rej) => {
    let query = {
      sql: "UPDATE task SET current = ? WHERE id = ?",
      timeout: 4000,
      values: [params.current, params.id]
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
  getTaskById: (params, res, rej) => {
    let query = {
      sql: "SELECT * FROM task where id = ?",
      timeout: 4000,
      values: [params.id]
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
  resetTaskCurrent: (params, res, rej) => {
    let query = {
      sql: "UPDATE task SET current = 0 WHERE refresh = ?",
      timeout: 4000,
      values: [params.type]
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  }
};
