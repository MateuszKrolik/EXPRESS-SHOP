const http = require("http");

function rqListener(req, res) {}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method, req.headers);
  //   process.exit();
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello from my Node.js Server!</h1></body>");
  res.write("</html>");
  res.end();
});

server.listen(3000);
