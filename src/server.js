import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

async function start() {
  await connectDB();

  app.listen(env.port, () => {
    console.log(`\n┌─────────────────────────────────────────────────┐`);
    console.log(`│  Bridge Initiative API                           │`);
    console.log(`│  Port: ${String(env.port).padEnd(38)}│`);
    console.log(`│  Env:  ${(env.nodeEnv).padEnd(38)}│`);
    console.log(`│  URL:  http://localhost:${env.port.toString().padEnd(25)}│`);
    console.log(`└─────────────────────────────────────────────────┘\n`);
  });
}

start();
