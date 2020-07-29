const cron = require("node-cron");
const taskModel = require("./model/task");
// 每天凌晨重置每日任务
cron.schedule("0 0 0 * * *", () => {
  taskModel.resetTaskCurrent(
    { type: "daily" },
    (dbRes) => {
      console.log("success1");
    },
    (err) => {
      console.log("fail");
    }
  );
});
// 每周1凌晨重置每周任务
cron.schedule("0 0 0 * * 1", () => {
  taskModel.resetTaskCurrent(
    { type: "weekly" },
    (dbRes) => {
      console.log("success2");
    },
    (err) => {
      console.log("fail");
    }
  );
});
// 每月1号凌晨重置每月任务
cron.schedule("0 0 0 1 * *", () => {
  taskModel.resetTaskCurrent(
    { type: "monthly" }, 
    (dbRes) => {
      console.log("success3");
    },
    (err) => {
      console.log("fail");
    }
  );
});
