const express = require("express");
const router = express.Router();
const wishModel = require("../model/wish");
const utils = require("../lib/utils");

/* GET home page. */
router.get("/list", (req, res, next) => {
  utils.checkQueryParams(req, res, ["openid"]);
  const params = req.query;
  wishModel.getList(
    params,
    (data) => res.status(200).json({ code: 200, data: data }),
    (err) => res.status(400).send(err)
  );
});

router.post("/finish", (req, res, next) => {
  const params = req.body;
  utils.checkBodyParams(req, res, ["id", "openid"]);
  wishModel.finish(
    params,
    (data) => res.status(200).json({ code: 200, data: data }),
    (err) => res.status(400).send(err)
  );
});

module.exports = router;
