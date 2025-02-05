import { createServer } from "node:http";
import { sequelize } from "./database/index.js";

await sequelize.authenticate().catch(console.error);

createServer((_, res) => {
  res.write("OK!!");
  res.end();
}).listen(process.env.PORT);
