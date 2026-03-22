"use server"
import {neon} from "@neondatabase/serverless"


function getSql(){
    const sql = neon(process.env.DATABASE_URL!);
    return sql;
}

