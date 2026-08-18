import mongoose from 'mongoose';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { connectDb, currentDbStatus, dbStatus } from './db.js';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('dbStatus', () => {
  it('reports up only when connected', () => {
    expect(dbStatus(mongoose.ConnectionStates.connected)).toBe('up');
  });

  it.each([
    ['disconnected', mongoose.ConnectionStates.disconnected],
    ['connecting', mongoose.ConnectionStates.connecting],
    ['disconnecting', mongoose.ConnectionStates.disconnecting],
    ['uninitialized', mongoose.ConnectionStates.uninitialized],
  ])('reports down while %s', (_label, readyState) => {
    expect(dbStatus(readyState)).toBe('down');
  });
});

describe('importing the module', () => {
  it('opens no connection on its own', () => {
    expect(mongoose.connection.readyState).toBe(
      mongoose.ConnectionStates.disconnected,
    );
    expect(currentDbStatus()).toBe('down');
  });
});

describe('connectDb', () => {
  it('rejects naming MONGODB_URI when it is missing, without dialing', async () => {
    // Declared-but-blank is how Render and a .env file both report "not set".
    vi.stubEnv('MONGODB_URI', '');
    const connect = vi.spyOn(mongoose, 'connect');

    await expect(connectDb()).rejects.toThrow(
      /Missing required environment variable: MONGODB_URI/,
    );
    expect(connect).not.toHaveBeenCalled();
  });
});
