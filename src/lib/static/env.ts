function assertEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const msClientID = assertEnv('MS_CLIENT_ID');
export const msClientSecret = assertEnv('MS_CLIENT_SECRET');
export const password = assertEnv('PASSWORD');

