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
    (data) => res.status(200).json({ code: 200, data: data }),
    (err) => res.status(400).send(err)
  );
});

router.post("/finish", (req, res, next) => {
  const params = req.body;
  utils.checkBodyParams(req, res, ["id", "openid"]);
  acheModel.finish(
    params,
    (data) => res.status(200).json({ code: 200, data: data }),
    (err) => res.status(400).send({ code: 50010, data: err })
  );
});

module.exports = router;
