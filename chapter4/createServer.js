const http = require("http");
const fs = require("fs").promises;

http
  .createServer(async (req, res) => {
    try {
      // fs.readFile 로 파일 읽기
      const data = await fs.readFile("./server2.html");
      res.writeHead(200, { "Content-type": "text-html; charset=utf-8" });
      res.end(data);
    } catch (error) {
      console.error(error);
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(err.message);
    }
  })
  .listen(8080, () => {
    console.log("8080번 포트에서 서버 대기 중이다.");
  });
