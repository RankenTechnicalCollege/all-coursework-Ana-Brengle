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

// async function ping() {
//     const db = await connectToDatabase();
//     const pong = await db.command({ping: 1});
//     debugDb('Ping')
    
// }

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


//---------------BUG DATABASE------------//
async function getAllBugs() {
    const db = await connectToDatabase();
    return db.collection('bugs').find({}).toArray();
}

async function getBugIds(id) {
    const db = await connectToDatabase();
    return db.collection('bugs').findOne({_id: new ObjectId(id)})
    
}

async function addedBug(title, stepsToReproduce, description) {
    const db = await connectToDatabase();
    return db.collection('bugs').insertOne({title: title, stepsToReproduce: stepsToReproduce, description: description, createdDate: new Date(Date.now()), lastUpdated: new Date(Date.now()), authorOfBug: null, edits:[], comments:[], classification: "", classifiedOn: null, assignedToUserId: null, assignedToUserName: null, assignedOn: null, testCases:[],workHoursLogged:[], fixInVersion: null, fixedOnDate: null, closed: false, closedOn: null});
}

async function getUpdatedBug(id, title, stepsToReproduce, description) {
    const db = await connectToDatabase();
    return db.collection('bugs').updateOne({_id: new ObjectId(id)}, {$set: {title: title, stepsToReproduce: stepsToReproduce, description: description, lastUpdated: new Date(Date.now())}})
}

async function classifyBug(id, classification) {
    const db = await connectToDatabase();
     return await db.collection("bugs").updateOne({_id: new ObjectId(id)},{$set: {classification: classification, classifiedOn: new Date(Date.now()), lastUpdated: new Date(Date.now())}});
}

async function assignBug(id, assignedToUserId, fullName) {
    const db = await connectToDatabase();
    return await db.collection("bugs").updateOne({_id: new ObjectId(id)}, {$set: {assignedToUserId: assignedToUserId, lastUpdated: new Date(Date.now()), assignedOn: new Date(Date.now()), assignedToUserName: fullName}})
}

async function getClosedBug(id, closed) {
    const db = await connectToDatabase();
    return await db.collection("bugs").updateOne({_id: new ObjectId(id)}, {$set: {closed: closed, lastUpdated: new Date(Date.now()), closedOn: new Date(Date.now())}});
}

async function getBugComments(id) {
    const db = await connectToDatabase();
    const bug = await db.collection("bugs").findOne({_id: new ObjectId(id)})
    return bug.comments
}

async function getCommentsId(id, commentId) {
    const db = await connectToDatabase();
    const bug = await db.collection("bugs").findOne({_id: new ObjectId(id)})
    if (!bug || !bug.comments) return null;
    const comment = bug.comments.find(c => c._id == commentId);
    debugDb(comment)
    return comment;
}

async function addCommentToBug(id, comment) {
    const db = await connectToDatabase();
    const newComment = await db.collection('bugs').updateOne({_id: new ObjectId(id)}, {$push: {comments: comment}})
    return newComment;
}

async function getBugTests(id) {
    const db = await connectToDatabase();
    const bug = await db.collection("bugs").findOne({_id: new ObjectId(id)})
    return bug.testCases
}

async function getTestsId(id, testId) {
    const db = await connectToDatabase();
    const bug = await db.collection("bugs").findOne({_id: new ObjectId(id)})
    if (!bug || !bug.testCases) return null;
    const test = bug.testCases.find(t => t.testId == testId);
    debugDb(test);
    return test;
}

async function addTestCase(id, testCase) {
    const db = await connectToDatabase()
    return await db.collection("bugs").updateOne({_id: new ObjectId(id)},{$push: {testCases : testCase}, $set: {lastUpdated: new Date()}});
}

async function getUpdatedTestCase(id, testId, title, testAuthor, status) {
    const db = await connectToDatabase();
    return await db.collection('bugs').updateOne({_id: new ObjectId(id), "testCases.testId": new ObjectId(testId)}, {$set: {"testCases.$.title": title,"testCases.$.testAuthor": testAuthor,"testCases.$.status": status,"testCases.$.lastUpdated": new Date()}})
}

async function deleteTestCase(id, testId) {
    const db = await connectToDatabase();
    const test = await db.collection("bugs").updateOne({_id: new ObjectId(id)},{$pull: {testCases: {testId: testId}}, $set: {lastUpdated: new Date()}});
    debugDb(test);
    return test;
}

export { getUsers, addUser, getUserById, getUserByEmail, getUpdatedUser, getDeletedUser, getAllBugs, getBugIds, addedBug, getUpdatedBug, classifyBug, assignBug, getClosedBug, getBugComments, getCommentsId, addCommentToBug, getBugTests, getTestsId, addTestCase, getUpdatedTestCase, deleteTestCase};
