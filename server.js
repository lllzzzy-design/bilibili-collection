const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const db = new sqlite3.Database("./videos.db");

db.run(`
  CREATE TABLE IF NOT EXISTS videos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bvid TEXT,
    category TEXT
  )
`);

// API 路由必须在 static 之前
app.get("/api/videos", (req, res) => {
  db.all("SELECT * FROM videos", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "数据库错误" });
    }
    res.json(rows);
  });
});

app.post("/api/videos", (req, res) => {
  const { bvid, category } = req.body;

  db.run(
    "INSERT INTO videos (bvid, category) VALUES (?, ?)",
    [bvid, category],
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "插入失败" });
      }
      res.json({ success: true });
    }
  );
});

// ⚠ static 必须放在 API 之后
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器运行在端口 ${PORT}`);
});