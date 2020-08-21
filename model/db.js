'use strict';
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: '121.36.201.82',
  port: '3306',
  user: 'root',
  password: 'Rexsun3948',
  database: 'daydayup'
});

//将结果已对象数组返回
const row = (sql) => {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
        return;
      }
      connection.query(sql, function (error, res) {
        connection.release();
        if (error) {
          reject(error);
          return;
        }
        resolve(res);
      });
    });
  });
};

//模块导出
module.exports = { row };