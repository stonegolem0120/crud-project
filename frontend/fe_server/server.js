const express = require("express");
const app = express();

// 정적 파일 호스팅 설정
app.use(express.static("dist"));

// 모든 경로에 대해 index.html 반환
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// 서버 시작
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
