import { createServer } from "node:http";

createServer((_, res) => {
  res.write("OK!!");
  res.end();
}).listen(process.env.PORT);
