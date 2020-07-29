const express = require("express");
const router = express.Router();
const acheModel = require("../model/ache");
const logModel = require("../model/log");
const utils = require("../lib/utils");

/* GET home page. */
router.get("/list", (req, res, next) => {
  const params = req.query;
  utils.checkQueryParams(req, res, ["openid"]);
  acheModel.getList(
    params,
    (dbRes, total, finished) => {
      res.status(200).json({
        code: 200,
        data: {
          total:total,
          finished:finished,
          list: utils.underlineToCamelCase(dbRes)
        },
        msg: "success",
      });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

router.post("/finish", (req, res, next) => {
  const params = req.body;
  utils.checkBodyParams(req, res, ["id", "openid"]);
  acheModel.getAcheById(
    params,
    (dbRes) => {
      let data = utils.underlineToCamelCase(dbRes)[0];
      if (data.finished == 1) {
        res.status(400).send({ code: 500100, data: null, msg: "成就已完成" });
      } else {
        acheModel.finish(
          params,
          (dbRes) => {
            data.calc = "add";
            data.refresh = "ache";
            data.openid = params.openid;
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
