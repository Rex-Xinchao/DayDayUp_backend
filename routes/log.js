const express = require("express");
const router = express.Router();
const logModel = require("../model/log");
const utils = require("../lib/utils");

/* GET home page. */
router.get("/list", (req, res, next) => {
  const params = req.query;
  utils.checkQueryParams(req, res, ['openid']);
  logModel.getList(
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

module.exports = router;
