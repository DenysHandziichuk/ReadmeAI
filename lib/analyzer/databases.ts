export function detectDatabases(
  files: string[],
  fileContents: Record<string, string>,
): string[] {
  const databases = new Set<string>();

  if (files.includes("docker-compose.yml") || files.includes("docker-compose.yaml")) {
    const composeRaw = fileContents["docker-compose.yml"] || fileContents["docker-compose.yaml"] || "";
    if (composeRaw.includes("postgres") || composeRaw.includes("postgresql")) databases.add("PostgreSQL");
    if (composeRaw.includes("mysql")) databases.add("MySQL");
    if (composeRaw.includes("mongo")) databases.add("MongoDB");
    if (composeRaw.includes("redis")) databases.add("Redis");
    if (composeRaw.includes("mariadb")) databases.add("MariaDB");
    if (composeRaw.includes("cassandra")) databases.add("Cassandra");
    if (composeRaw.includes("influxdb")) databases.add("InfluxDB");
    if (composeRaw.includes("clickhouse")) databases.add("ClickHouse");
  }

  const pkgContent = fileContents["package.json"] || "";
  if (pkgContent.includes('"pg"') || pkgContent.includes('"@neondatabase/serverless"')) databases.add("PostgreSQL");
  if (pkgContent.includes('"mysql2"')) databases.add("MySQL");
  if (pkgContent.includes('"mongoose"') || pkgContent.includes('"mongodb"')) databases.add("MongoDB");
  if (pkgContent.includes('"ioredis"') || pkgContent.includes('"redis"')) databases.add("Redis");
  if (pkgContent.includes('"better-sqlite3"') || pkgContent.includes('"sqlite3"')) databases.add("SQLite");
  if (pkgContent.includes('"@supabase/supabase-js"')) databases.add("Supabase");
  if (pkgContent.includes('"firebase"') || pkgContent.includes('"firebase-admin"')) databases.add("Firebase");
  if (pkgContent.includes('"@prisma/client"') || pkgContent.includes('"prisma"')) databases.add("Prisma");
  if (pkgContent.includes('"drizzle-orm"')) databases.add("Drizzle");

  const pyprojectContent = fileContents["pyproject.toml"] || "";
  const requirementsContent = fileContents["requirements.txt"] || "";
  const pyDeps = pyprojectContent + " " + requirementsContent;

  if (pyDeps.includes("psycopg") || pyDeps.includes("postgresql") || pyDeps.includes("django.db.backends.postgresql")) databases.add("PostgreSQL");
  if (pyDeps.includes("mysqlclient") || pyDeps.includes("pymysql") || pyDeps.includes("mysql-connector")) databases.add("MySQL");
  if (pyDeps.includes("pymongo") || pyDeps.includes("mongoengine")) databases.add("MongoDB");
  if (pyDeps.includes("redis")) databases.add("Redis");
  if (pyDeps.includes("sqlalchemy") || pyDeps.includes("django.db")) databases.add("SQLAlchemy");

  const cargoContent = fileContents["Cargo.toml"] || "";
  if (cargoContent.includes("diesel")) databases.add("Diesel");
  if (cargoContent.includes("sqlx")) databases.add("SQLx");
  if (cargoContent.includes("sea-orm")) databases.add("SeaORM");
  if (cargoContent.includes("redis")) databases.add("Redis");

  const goModContent = fileContents["go.mod"] || "";
  if (goModContent.includes("gorm.io") || goModContent.includes("entgo.io")) databases.add("GORM");
  if (goModContent.includes("go-redis") || goModContent.includes("redis")) databases.add("Redis");
  if (goModContent.includes("mongo-driver") || goModContent.includes("mgo")) databases.add("MongoDB");
  if (goModContent.includes("pgx") || goModContent.includes("lib/pq")) databases.add("PostgreSQL");

  if (files.some((f) => f.endsWith(".prisma"))) databases.add("Prisma");

  if (files.some((f) => f.endsWith(".sql")) && databases.size === 0) {
    databases.add("SQL");
  }

  return Array.from(databases);
}
