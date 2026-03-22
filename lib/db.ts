"use server"
import {neon} from "@neondatabase/serverless"


export function getSql(){
    const sql = neon(process.env.DATABASE_URL!);
    return sql;
}

