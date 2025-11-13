import debug from 'debug';
import * as dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ObjectId } from 'mongodb';

const debugDB = debug('app:Database');

let _db = null;
let _client = null;

async function connectToDatabase() {
    if (!_db) {
        const dbUrl = process.env.MONGO_URI;
        const dbName = process.env.MONGO_DB_NAME;

        const client = await MongoClient.connect(dbUrl)
        _db = client.db(dbName);
        debugDB('Connected to database');
    }
    return _db;
}

async function ping() {
    const db = await connectToDatabase();
    const pong = await db.command({ping: 1});
    debugDb('Ping')
    
}

async function getClient() {
    if(!_client){
        await connectToDatabase();
    }
    return _client
}

async function getDatabase() {
    return await connectToDatabase();
}

async function saveAuditLog(log) {
    const db = await connectToDatabase();
    await db.collection('edits').insertOne(log)
}

export{ping, getClient, getDatabase, saveAuditLog}