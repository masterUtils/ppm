function assertNonNull(key?: string) {
  if (!key) {
    throw new Error("env key is null");
  }
  return key;
}

export const msClientID = assertNonNull(process.env.MS_CLIENT_ID);
export const msClientSecret = assertNonNull(process.env.MS_CLIENT_SECRET);
export const password = assertNonNull(process.env.PASSWORD);

