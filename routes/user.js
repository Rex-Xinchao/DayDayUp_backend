const express = require("express");
const router = express.Router();
const userModel = require("../model/user");
const utils = require("../lib/utils");

router.get("/Info", (req, res, next) => {
  const params = req.query;
  utils.checkQueryParams(req, res, ["openid"]);
  userModel.getInfo(
    params,
    (dbRes) => {
      res.status(200).send({ code: 200, data: dbRes, msg: "success" });
    },
    (err) => {
      res.status(400).send(err);
    }
  );
});

module.exports = router;
