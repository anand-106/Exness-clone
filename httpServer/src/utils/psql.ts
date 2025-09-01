import { Pool } from 'pg';

export const pool = new Pool(
    {
        user: "postgres",
        host: "localhost",
        database: "postgres",
        password: "password",
        port: 5433, 
    }
)
