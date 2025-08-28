import mysql from "mysql2/promise"

// Configuración de la conexión
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Poseidon",
  database: process.env.DB_NAME || "movil_express_db",
  charset: "utf8mb4",
  timezone: "+00:00",
  //acquireTimeout: 60000,
  //timeout: 60000,
  //reconnect: true,
}

// Pool de conexiones
let pool: mysql.Pool | null = null

function createPool() {
  if (!pool) {
    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // acquireTimeout: 60000, // ❌ quita esta línea
      // timeout: 60000,        // ❌ quita esta línea
    })
  }
  return pool
}

// Función para obtener conexión
export async function getConnection() {
  const connectionPool = createPool()
  return await connectionPool.getConnection()
}

// Función para ejecutar consultas
export async function executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
  const connection = await getConnection()
  try {
    console.log("🔍 Executing query:", query)
    console.log("📝 With params:", params)

    const [rows] = await connection.execute(query, params)
    console.log("✅ Query executed successfully, rows:", Array.isArray(rows) ? rows.length : "N/A")

    return rows as T[]
  } catch (error) {
    console.error("❌ Database query error:", error)
    console.error("🔍 Failed query:", query)
    console.error("📝 Failed params:", params)
    throw error
  } finally {
    connection.release()
  }
}

// Función para ejecutar consulta única
export async function executeQuerySingle<T = any>(query: string, params: any[] = []): Promise<T | null> {
  const results = await executeQuery<T>(query, params)
  return results.length > 0 ? results[0] : null
}

// Función para contar registros
export async function executeCount(query: string, params: any[] = []): Promise<number> {
  const result = await executeQuerySingle<{ count: number }>(query, params)
  return result?.count || 0
}

// Función para transacciones
export async function executeTransaction(queries: Array<{ query: string; params: any[] }>): Promise<any[]> {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()

    const results = []
    for (const { query, params } of queries) {
      console.log("🔄 Transaction query:", query)
      const [result] = await connection.execute(query, params)
      results.push(result)
    }

    await connection.commit()
    console.log("✅ Transaction completed successfully")
    return results
  } catch (error) {
    await connection.rollback()
    console.error("❌ Transaction failed, rolled back:", error)
    throw error
  } finally {
    connection.release()
  }
}

// Función para probar conexión
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await getConnection()
    await connection.ping()
    connection.release()
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// Función para cerrar pool
export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
    console.log("🔒 Database pool closed")
  }
}
