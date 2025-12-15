// Test defaults to keep everything local and self-contained.
process.env.NODE_ENV ??= "test";
process.env.DATABASE_URL ??= "file:./dev.db";
process.env.JWT_ACCESS_SECRET ??= "test-access-secret-123456";
process.env.JWT_REFRESH_SECRET ??= "test-refresh-secret-123456";
process.env.JWT_ACCESS_EXPIRES_IN ??= "15m";
process.env.JWT_REFRESH_EXPIRES_IN ??= "7d";

