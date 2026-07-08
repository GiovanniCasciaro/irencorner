export function getSessionSecret() {
  const secret =
    process.env.SESSION_SECRET ??
    (process.env.NODE_ENV === "development"
      ? "dev-session-secret-solo-in-locale"
      : undefined);

  if (!secret) {
    throw new Error("SESSION_SECRET non configurato.");
  }

  return new TextEncoder().encode(secret);
}

export function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
