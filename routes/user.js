const express = require('express')
const router = express.Router()
const userModel = require('../model/user')
const utils = require('../lib/utils')
const request = require('request')

router.get('/getId', (req, res, next) => {
  const params = req.query
  let code = params.code
  request(
    {
      url:
        'https://api.weixin.qq.com/sns/jscode2session?appid=wx9d2b9aad36bb0047&secret=6cce3131885af699672361cb2130c09b&js_code=' + code + '&grant_type=authorization_code',
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    },
    function (err, response, body) {
      if(response.statusCode == 200) {
        res.status(200).send({ code: 200, data: JSON.parse(body).openid, msg: 'success' })
      }
    }
  )
})

router.get('/Info', (req, res, next) => {
  const params = req.query
  utils.checkQueryParams(req, res, ['openid'])
  userModel.getInfo(
    params,
    (dbRes) => {
      res.status(200).send({ code: 200, data: dbRes, msg: 'success' })
    },
    (err) => {
      res.status(400).send(err)
    }
  )
})

module.exports = router
