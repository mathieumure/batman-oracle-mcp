import { auth } from './auth.js';

export const DEMO_EMAIL = 'alfred@wayne-enterprises.com';
export const DEMO_PASSWORD = 'IAmBatman!123';

export async function seedDemoUser(): Promise<void> {
  try {
    await auth.api.signUpEmail({
      body: {
        name: 'Alfred Pennyworth',
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    });
    console.log(`Seeded demo user: ${DEMO_EMAIL}`);
  } catch (error) {
    console.log(`Demo user seed skipped (likely already exists): ${(error as Error).message}`);
  }
}
