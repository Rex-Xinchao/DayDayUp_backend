const express = require("express");
const router = express.Router();
const wishModel = require("../model/wish");
const logModel = require("../model/log");
const utils = require("../lib/utils");

/* GET home page. */
router.get("/list", (req, res, next) => {
  utils.checkQueryParams(req, res, ["openid"]);
  const params = req.query;
  wishModel.getList(
    params,
    (dbRes, total) => {
      res.status(200).json({
        code: 200,
        data: {
          total:total,
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
  wishModel.getAcheById(
    params,
    (dbRes) => {
      let data = utils.underlineToCamelCase(dbRes)[0];
      wishModel.finish(
        params,
        (dbRes) => {
          data.calc = "remove";
          data.refresh = "wish";
          data.time = data.time + 1;
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
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

module.exports = router;
