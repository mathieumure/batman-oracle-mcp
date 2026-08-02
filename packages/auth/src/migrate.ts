import { getMigrations } from 'better-auth/db/migration';
import { auth } from './auth.js';

const { runMigrations, toBeCreated } = await getMigrations(auth.options);

if (toBeCreated.length === 0) {
  console.log('Database already up to date.');
} else {
  console.log(
    'Creating tables:',
    toBeCreated.map((t) => t.table).join(', '),
  );
  await runMigrations();
  console.log('Migration done.');
}
