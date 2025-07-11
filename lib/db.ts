import sql from 'mssql';

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3342;

if (
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_SERVER ||
  !process.env.DB_DATABASE
) {
  throw new Error('❌ 필수 DB 환경변수가 설정되어 있지 않습니다');
}

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableAnsiNullDefault: true,
    useUTC: false
  }
};

let connectionPool: sql.ConnectionPool | null = null;

export async function getDBConnection(): Promise<sql.ConnectionPool> {
  if (!connectionPool) {
    try {
      connectionPool = await sql.connect(config);
      console.log('✅ DB 연결 성공');
    } catch (error) {
      console.error('❌ DB 연결 실패:', error);
      throw error;
    }
  }
  return connectionPool;
}

// ✅ 추가된 부분: 저장 프로시저 실행 유틸
export async function executeProcedure(
  procName: string,
  inputParams: Record<string, unknown>
): Promise<sql.IRecordSet<unknown>> {
  const pool = await getDBConnection();
  const request = pool.request();

  for (const key in inputParams) {
    request.input(key, inputParams[key]);
  }

  const result = await request.execute(procName);
  return result.recordset;
}

export { sql };
