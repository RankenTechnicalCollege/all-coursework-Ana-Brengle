import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();
import debug from 'debug';

const debugDb = debug('app:Database');

let _db = null;

async function connectToDatabase() {
    if(!_db){
        const connectionString = process.env.MONGO_URI;
        const dbName = process.env.MONGO_DB_NAME;
        
        const client = await MongoClient.connect(connectionString);

        _db = client.db(dbName);
        //debugDb('Connected.');
    }
    return _db;
}

async function ping() {
    const db = await connectToDatabase();
    const pong = await db.command({ping: 1});
    debugDb('Ping')
    
}

async function getProducts() {
    const db = await connectToDatabase();
    return await db.collection('products').find({}).toArray();
}

async function getProductByName(productName) {
   const db = await connectToDatabase();
   return await db.collection('products').findOne({name: productName})
}

async function getProductId(productId) {
    const db = await connectToDatabase();
   return await db.collection('products').findOne({_id: new ObjectId(productId)});
}
export  {ping, getProducts, getProductByName, getProductId}