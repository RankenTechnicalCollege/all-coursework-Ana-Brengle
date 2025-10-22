import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

const debugDb = debug('app:Database');

let _db = null;
let _client = null;

async function connectToDatabase() {
    if(!_db) {
        const connectionString = process.env.MONGO_DB_URL;
        const dbName = process.env.MONGO_DB_NAME;

        _client = await MongoClient.connect(connectionString);
        _db = _client.db(dbName)
    }
    return _db;
}

async function ping() {
    const db = await connectToDatabase();
    const pong = await db.command({ping: 1});
    debugDb('Ping', pong)
    
}
async function getClient() {
    if(!_client){
        await connectToDatabase();
    }
    return _client
}
ping()

export {ping, getClient}