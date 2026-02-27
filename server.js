const express = require("express");
const app = express();

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000");
});