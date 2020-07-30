const db = require("./db");
const utils = require("../lib/utils");
const userModel = require("./user");
const getTask = (params) => {
  let query = {
    sql: "SELECT * FROM task where id = ?",
    timeout: 4000,
    values: [params.id],
  };
  return db.row(query).then(
    (dbRes) => utils.underlineToCamelCase(dbRes)[0],
    (err) => null
  );
};
module.exports = {
  getList: (params, res, rej) => {
    let query = {
      sql: "SELECT * FROM task where userId = ?",
      timeout: 4000,
      values: [params.openid],
    };
    db.row(query).then(
      (dbRes) => res(utils.underlineToCamelCase(dbRes)),
      (err) => rej(err)
    );
  },
  update: async (params, res, rej) => {
    const task = await getTask(params);
    if (!task) {
      rej("任务不存在");
    } else if (task.current === task.limit) {
      rej("任务已完成");
    }
    task.current = Number(params.current);
    let query = {
      sql: "UPDATE task SET current = ? WHERE id = ?",
      timeout: 4000,
      values: [params.current, params.id],
    };
    db.row(query).then(
      (dbRes) => {
        let userParams = { ...task, calc: "add", openid: params.openid };
        userModel.setPoint(
          userParams,
          (dbRes) => res(task),
          (err) => rej(err)
        )
      },
      (err) => rej(err)
    );
  },
  resetTaskCurrent: (params, res, rej) => {
    let query = {
      sql: "UPDATE task SET current = 0 WHERE refresh = ?",
      timeout: 4000,
      values: [params.type],
    };
    db.row(query).then(
      (dbRes) => res(dbRes),
      (err) => rej(err)
    );
  },
};
