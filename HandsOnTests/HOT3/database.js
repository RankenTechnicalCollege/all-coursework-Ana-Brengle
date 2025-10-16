import * as dotenv from 'dotenv';

dotenv.config();
import debug from 'debug';
import { MongoClient, } from "mongodb";
const debugDb = debug('app:Database');

let _db = null;
async function connectToDatabase() {
    if(!_db){
        const dbUrl = process.env.DB_URL;
        const dbName = process.env.DB_NAME;
        
        const client = await MongoClient.connect(dbUrl);
        _db = client.db(dbName);
        debugDb('Connected.');
    }
    return _db;
    
}

async function ping() {
    const db = await connectToDatabase();
    const pong = await db.command({ping: 1});
    debugDb('Ping')
    
}
export  {ping}