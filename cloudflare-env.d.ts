declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    PYPATH_PASSWORD_HASH: string;
    PYPATH_SESSION_SECRET: string;
  }
}
