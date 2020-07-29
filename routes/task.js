const express = require("express");
const router = express.Router();
const taskModel = require("../model/task");
const logModel = require("../model/log");
const utils = require("../lib/utils");

/* GET home page. */
router.get("/list", (req, res, next) => {
  const params = req.query;
  utils.checkQueryParams(req, res, ['openid']);
  taskModel.getList(
    params,
    (dbRes) => {
      res.status(200).json({
        code: 200,
        data: utils.underlineToCamelCase(dbRes),
        msg: "success",
      });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

router.post("/update", (req, res, next) => {
  const params = req.body;
  utils.checkBodyParams(req, res, ["id", "current", "openid"]);
  taskModel.getTaskById(
    params,
    (dbRes) => {
      let data = utils.underlineToCamelCase(dbRes)[0];
      if (data.current === data.limit) {
        res.status(400).send({ code: 500100, data: null, msg: "任务已完成" });
      } else {
        taskModel.update(
          params,
          (dbRes) => {
            if (parseInt(params.current) === parseInt(data.limit)) {
              data.calc = 'add'
              data.openid = params.openid
              logModel.addLog(
                data,
                (dbRes) => {
                  res
                    .status(200)
                    .json({ code: 200, data: "更新成功", msg: "success" });
                },
                (err) => {
                  res.status(400).send(err);
                }
              );
            } else {
              res
                .status(200)
                .json({ code: 200, data: "更新成功", msg: "success" });
            }
          },
          (err) => {
            res.status(400).send(err);
          }
        );
      }
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

module.exports = router;
