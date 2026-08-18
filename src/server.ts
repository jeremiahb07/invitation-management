import express, { Request, Response } from 'express';

import { connectDb, disconnectDb } from './lib/db.js';
import { healthRouter } from './routes/health.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(healthRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

// Connect before listening, so the app never serves a request it cannot fulfil.
// Without a database there is nothing to serve, so fail loudly instead of
// starting up degraded.
try {
  await connectDb();
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error);
  console.error(`Could not connect to MongoDB: ${reason}`);
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Render sends SIGTERM on deploy and shutdown; Ctrl-C sends SIGINT.
for (const signal of ['SIGTERM', 'SIGINT'] as const) {
  process.on(signal, () => {
    server.close(async () => {
      await disconnectDb();
      process.exit(0);
    });
  });
}
