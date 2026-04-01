import prisma from './prisma';

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const isConnectionError =
        err?.code === 'P1001' ||
        err?.code === 'P1017' ||
        err?.message?.includes('Connection pool timeout') ||
        err?.message?.includes("Can't reach database server");

      if (isConnectionError && i < retries) {
        console.warn(`DB connection error, retrying (${i + 1}/${retries})...`);
        await prisma.$disconnect();
        await new Promise((res) => setTimeout(res, 1000 * (i + 1))); // wait 1s, then 2s
        await prisma.$connect();
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
}
