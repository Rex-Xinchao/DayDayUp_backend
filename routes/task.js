const express = require("express");
const router = express.Router();
const taskModel = require("../model/task");
const logModel = require("../model/log");
const utils = require("../lib/utils");

/* GET home page. */
router.get("/list", (req, res, next) => {
  const params = req.query;
  utils.checkQueryParams(req, res, ["openid"]);
  taskModel.getList(
    params,
    (data) => res.status(200).json({ code: 200, data: data }),
    (err) => res.status(400).send({ code: 50010, data: err })
  );
});

router.post("/update", (req, res, next) => {
  const params = req.body;
  utils.checkBodyParams(req, res, ["id", "current", "openid"]);
  taskModel.update(
    params,
    (data) => res.status(200).json({ code: 200, data: data }),
    (err) => res.status(400).send({ code: 50010, data: err })
  );
});

module.exports = router;
