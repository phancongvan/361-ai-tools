import { neon } from '@neondatabase/serverless';

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

// Helper: run a tagged template query
export async function query(sql: ReturnType<typeof neon>, text: TemplateStringsArray, ...values: any[]) {
  return sql(text, ...values);
}
