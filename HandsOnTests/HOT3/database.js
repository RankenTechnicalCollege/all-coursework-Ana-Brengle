import * as dotenv from 'dotenv';

dotenv.config();

import { MongoClient, ObjectId } from 'mongodb';
import debug from 'debug';

const debugDb = debug('app:Database');

const newId = (str) => ObjectId.createFromHexString(str);

let _db = null;
let _client = null;



async function connectToDatabase() {
    if(!_db) {
        const dbUrl = process.env.MONGO_URI;
        const dbName = process.env.MONGO_DB_NAME;
        
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

async function getProducts(filter, pageSize, skip, sort) {
    const db = await connectToDatabase();
    return await db.collection('products').find(filter).sort(sort).skip(skip).limit(pageSize).toArray();
}

async function getProductByName(productName) {
   const db = await connectToDatabase();
   return await db.collection('products').findOne({name: productName})
}

async function getProductId(productId) {
    const db = await connectToDatabase();
    return await db.collection('products').findOne({_id: new ObjectId(productId)});
}

async function addedProduct(product) {
    const db = await connectToDatabase();
    return await db.collection('products').insertOne(product);
}

async function getUpdatedProduct(productId, name, description, category, price) {
    const db = await connectToDatabase();
    return await db.collection("products").updateOne({_id: new ObjectId(productId)},{$set: {name: name, description: description, category: category, price: price, lastUpdatedOn: new Date()}});
}

async function deletedProduct(productId) {
    const db = await connectToDatabase();
    return await db.collection("products").deleteOne({_id: new ObjectId(productId)});
}

async function getUsers() {
    const db = await connectToDatabase();
    return await db.collection('user').find({}).toArray();
}

async function getUserById(userId) {
    const db = await connectToDatabase();
    return await db.collection('user').findOne({_id: new ObjectId(userId)});
}

async function getUpdatedUser(userId, fullName, email, password) {
     const db = await connectToDatabase();
    return await db.collection('user').updateOne({_id: new ObjectId(userId)}, {$set: {fullName: fullName, password: password, email: email, lastUpdatedOn: new Date()}});
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

export  {ping, getProducts, getProductByName, getProductId, addedProduct, getUpdatedProduct, deletedProduct, getClient, connectToDatabase, getDatabase, getUsers, getUserById, getUpdatedUser}