import * as dotenv from 'dotenv';

dotenv.config();

import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

const debugDb = debug('app:Database');

const newId = (str) => ObjectId.createFromHexString(str);

let _db = null;

async function connect() {
    if(!_db) {
        const dbUrl = process.env.DB_URL;
        const dbName = process.env.DB_NAME;
        
        const client = await MongoClient.connect(dbUrl);
        _db = client.db(dbName);
        debugDb('Connected.');
    }
    return _db;
    
}

async function ping() {
    const db = await connect();
    const pong = await db.command({ping: 1});
    debugDb('Ping')
    
}

async function getUsers() {
    const db = await connect();
    return db.collection('users').find({}).toArray();
}

export {ping, getUsers}
