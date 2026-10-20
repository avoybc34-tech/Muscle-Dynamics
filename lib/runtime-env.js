// Render has no Blueprint string interpolation. Build the private MariaDB URL at runtime.
// Never expose this value in public JS, API config or logs.
export function applyRuntimeEnvironment(env = process.env) {
  if (!env.DATABASE_URL) {
    const { DB_HOST, DB_PORT = '3306', DB_NAME = 'muscle_dynamics', DB_USER, DB_PASSWORD } = env;
    if (!DB_HOST || !DB_USER || !DB_PASSWORD) throw Error('Database configuration missing. Deploy both Render Blueprint services, or set a private mysql:// DATABASE_URL.');
    if (!/^[a-zA-Z0-9.-]+$/.test(DB_HOST) || !/^[a-zA-Z0-9_]+$/.test(DB_NAME)) throw Error('Invalid database host or database name.');
    const port = Number(DB_PORT);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw Error('Invalid database port.');
    env.DATABASE_URL = `mysql://${encodeURIComponent(DB_USER)}:${encodeURIComponent(DB_PASSWORD)}@${DB_HOST}:${port}/${DB_NAME}?connection_limit=8&connect_timeout=5&pool_timeout=10`;
  }
  let db;
  try { db = new URL(env.DATABASE_URL); } catch { throw Error('Database connection URL is invalid.'); }
  if (db.protocol !== 'mysql:') throw Error('This full project uses MariaDB through a mysql:// connection, not PostgreSQL.');
  const origin = env.APP_URL || env.RENDER_EXTERNAL_URL || (env.RENDER_EXTERNAL_HOSTNAME ? `https://${env.RENDER_EXTERNAL_HOSTNAME}` : '');
  if (origin) {
    let parsed; try { parsed = new URL(origin); } catch { throw Error('Website origin configuration is invalid.'); }
    if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash || !['', '/'].includes(parsed.pathname)) throw Error('Website APP_URL must be a plain origin, without credentials or paths.');
    if (env.NODE_ENV === 'production' && parsed.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(parsed.hostname)) throw Error('A production website origin must use HTTPS.');
    env.APP_URL = parsed.origin;
  }
  return env;
}
