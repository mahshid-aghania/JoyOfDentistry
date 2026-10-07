// One-off: apply a SQL migration to the JoD Supabase project via the IPv4
// session pooler. The direct DB host is IPv6-only (no route here) and the
// access token lacks control-plane rights, so we connect with the DB password
// and auto-detect the project region by trying each pooler.
//
//   JOD_DB_PASSWORD='...' node scripts/apply-migration.mjs supabase/migrations/0001_init.sql
import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const REF = "zdqsafuzbsfhrvsjaygc";
const PASSWORD = process.env.JOD_DB_PASSWORD;
const sqlPath = resolve(process.argv[2] || "supabase/migrations/0001_init.sql");
if (!PASSWORD) { console.error("Missing JOD_DB_PASSWORD"); process.exit(1); }
const sql = readFileSync(sqlPath, "utf8");

const REGIONS = [
  "ca-central-1", "us-east-1", "us-east-2", "us-west-1", "us-west-2",
  "sa-east-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-central-1",
  "eu-central-2", "eu-north-1", "ap-south-1", "ap-southeast-1",
  "ap-southeast-2", "ap-northeast-1", "ap-northeast-2",
];
const PREFIXES = ["aws-0", "aws-1"];

async function tryConnect(host) {
  const client = new pg.Client({
    host,
    port: 5432,
    user: `postgres.${REF}`,
    password: PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
    statement_timeout: 120000,
  });
  await client.connect();
  return client;
}

const main = async () => {
  for (const region of REGIONS) {
    for (const prefix of PREFIXES) {
      const host = `${prefix}-${region}.pooler.supabase.com`;
      try {
        const client = await tryConnect(host);
        console.log(`✓ connected via ${host}`);
        try {
          await client.query(sql);
          console.log("✓ migration applied");
          const r = await client.query(
            "select table_name from information_schema.tables where table_schema='public' order by table_name",
          );
          console.log("public tables:", r.rows.map((x) => x.table_name).join(", "));
          await client.end();
          console.log(`REGION=${region} PREFIX=${prefix}`);
          process.exit(0);
        } catch (e) {
          console.error("✗ migration error:", e.message);
          await client.end();
          process.exit(2);
        }
      } catch (e) {
        const m = (e.message || "").toLowerCase();
        if (m.includes("tenant or user not found") || m.includes("timeout") || m.includes("enotfound") || m.includes("econnrefused")) {
          continue; // wrong region, keep scanning
        }
        if (m.includes("password authentication failed")) {
          console.error(`✗ wrong DB password (reached ${host})`); process.exit(3);
        }
        // unknown error — log and continue
        process.stderr.write(`  · ${host}: ${e.code || e.message}\n`);
      }
    }
  }
  console.error("✗ could not locate project region on any pooler");
  process.exit(4);
};
main();
