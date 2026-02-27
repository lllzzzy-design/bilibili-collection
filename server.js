const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 自动创建表
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS videos (
      id SERIAL PRIMARY KEY,
      bvid TEXT NOT NULL,
      category TEXT NOT NULL
    )
  `);
  console.log("数据库已准备好");
}

initDB();

// 获取视频
app.get("/api/videos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM videos ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "数据库读取失败" });
  }
});

// 添加视频
app.post("/api/videos", async (req, res) => {
  const { bvid, category } = req.body;

  try {
    await pool.query(
      "INSERT INTO videos (bvid, category) VALUES ($1, $2)",
      [bvid, category]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "插入失败" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`服务器运行在端口 ${PORT}`);
});