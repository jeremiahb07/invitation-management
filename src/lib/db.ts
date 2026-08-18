import mongoose from 'mongoose';

import { requireEnv } from './env.js';

// Mongoose waits 30s by default before giving up on server selection, long enough
// that a wrong URI reads as a hang instead of a failure. Fail while whoever
// started the process is still watching the log.
const SERVER_SELECTION_TIMEOUT_MS = 10_000;

export type DbStatus = 'up' | 'down';

// Only `connected` can serve a query; connecting, disconnecting, disconnected and
// uninitialized all mean the next command would buffer or fail.
export function dbStatus(readyState: number): DbStatus {
  return readyState === mongoose.ConnectionStates.connected ? 'up' : 'down';
}

export function currentDbStatus(): DbStatus {
  return dbStatus(mongoose.connection.readyState);
}

export async function connectDb(
  uri: string = requireEnv('MONGODB_URI'),
): Promise<void> {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });
}

export async function disconnectDb(): Promise<void> {
  await mongoose.disconnect();
}
