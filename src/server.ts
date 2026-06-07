import dotenv from "dotenv";

import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});