import { describe, expect, it } from 'vitest';

import { readEnv, readEnvOr, requireEnv } from './env.js';

describe('readEnv', () => {
  it('returns the value when set', () => {
    expect(readEnv('PORT', { PORT: '3000' })).toBe('3000');
  });

  it('trims surrounding whitespace', () => {
    expect(readEnv('PORT', { PORT: '  3000  ' })).toBe('3000');
  });

  it('returns undefined when absent', () => {
    expect(readEnv('PORT', {})).toBeUndefined();
  });

  it('returns undefined when set but blank', () => {
    expect(readEnv('PORT', { PORT: '   ' })).toBeUndefined();
  });
});

describe('readEnvOr', () => {
  it('prefers the configured value', () => {
    expect(readEnvOr('PORT', '3000', { PORT: '8080' })).toBe('8080');
  });

  it('falls back when absent', () => {
    expect(readEnvOr('PORT', '3000', {})).toBe('3000');
  });

  it('falls back when set but blank', () => {
    expect(readEnvOr('PORT', '3000', { PORT: '' })).toBe('3000');
  });
});

describe('requireEnv', () => {
  it('returns the value when set', () => {
    expect(requireEnv('MONGODB_URI', { MONGODB_URI: 'mongodb://localhost' })).toBe(
      'mongodb://localhost',
    );
  });

  it('throws naming the variable when absent', () => {
    expect(() => requireEnv('MONGODB_URI', {})).toThrow(
      /Missing required environment variable: MONGODB_URI/,
    );
  });

  it('throws when set but blank', () => {
    expect(() => requireEnv('MONGODB_URI', { MONGODB_URI: '' })).toThrow(
      /MONGODB_URI/,
    );
  });
});
