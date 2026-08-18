// A var that was declared but left blank comes back as "" from both Render and a
// .env file. That is a missing value, not a configured one.
function clean(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  return value ? value : undefined;
}

export function readEnv(
  name: string,
  env: NodeJS.ProcessEnv = process.env,
): string | undefined {
  return clean(env[name]);
}

export function readEnvOr(
  name: string,
  fallback: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  return clean(env[name]) ?? fallback;
}

export function requireEnv(
  name: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const value = clean(env[name]);
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
