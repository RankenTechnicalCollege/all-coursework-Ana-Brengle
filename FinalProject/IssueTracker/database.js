import * as dotenv from 'dotenv';

dotenv.config();

import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

const debugDb = debug('app:Database');

const newId = (str) => ObjectId.createFromHexString(str);

let _db = null;

async function connectToDatabase() {
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
    const db = await connectToDatabase();
    const pong = await db.command({ping: 1});
    debugDb('Ping')
    
}

async function getUsers() {
    const db = await connectToDatabase();
    return db.collection('users').find({}).toArray();
}

async function addUser(user) {
    const db = await connectToDatabase();
    return db.collection('users').insertOne(user);
}

async function getUserById(id) {
    const db = await connectToDatabase();
    return db.collection('users').findOne({_id: new ObjectId(id)})
}

async function getUserByEmail(email) {
    const db = await connectToDatabase();
    return db.collection('users').findOne({email: email})
    
}

async function getUpdatedUser(id, password, givenName, familyName, fullName, role) {
    const db = await connectToDatabase();
    return db.collection('users').updateOne({_id: new ObjectId(id)}, {$set: {password: password, fullName: fullName, givenName: givenName, familyName: familyName, role: role, lastUpdated: new Date()}})
}

async function getDeletedUser(id) {
    const db = await connectToDatabase();
    return db.collection('users').deleteOne({_id: new ObjectId(id)})
}



export {ping, getUsers, addUser, getUserById, getUserByEmail, getUpdatedUser, getDeletedUser};
