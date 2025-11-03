import express from 'express';
import debug from 'debug';
const router = express.Router();
import { addBugSchema, updateBugSchema, classifyBugSchema, assignBugSchema, closeBugSchema} from '../../validation/bugSchema.js';
import { getAllBugs,getBugId, addedBug, getUpdatedBug, classifyBug, getUserById, assignBug, getClosedBug, saveAuditLog, updateUserCreatedBugs} from '../../database.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { hasPermission } from '../../middleware/hasPermissions.js';
//import { ObjectId } from 'mongodb';
const debugBug = debug('app:BugRouter');
router.use(express.json())
router.use(express.urlencoded({extended: false}));

router.get('', isAuthenticated, hasPermission('canViewData'),async(req, res) => {
    try{
        const {keywords, classification, minAge, maxAge, closed, page, limit, sortBy} = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 0;
        const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;
        
        const filter = {};
        if (keywords) filter.$text = { $search: keywords };
        if (classification) filter.classification = classification;
        if (closed !== undefined) filter.closed = closed === 'true';

        if (minAge || maxAge) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateFilter = {};
            if (maxAge) dateFilter.$gte = new Date(today.getTime() - maxAge * 24 * 60 * 60 * 1000);
            if (minAge) dateFilter.$lte = new Date(today.getTime() - minAge * 24 * 60 * 60 * 1000);
            filter.createdOn = dateFilter;
        }


        const sortOptions = {
            newest: {createdOn: -1},
            oldest: {createdOn: 1},
            title: {title: 1, createdOn: -1},
            classification: {classification: 1, createdOn: -1},
            assignedTo: {assignedToUserName: 1, createdOn: -1},
            createdBy: {authorOfBug: 1, createdOn: -1}
        }

        const sort = sortOptions[sortBy] || sortOptions.newest



        const bugs = await getAllBugs(filter, sort, skip, limitNum);
        if(!bugs){
            res.status(404).json({message: "Bugs not Found"})
        } else {
            res.status(200).json(bugs)
        }
    }catch (error) {
        console.error("Error loading bugs:", error);
        res.status(500).json({ message: 'Error loading bugs.' });
    }
});

router.get('/:bugId', isAuthenticated, hasPermission("canViewData"), validId('bugId'), async(req, res) => {
    try {
        const id = req.params.bugId;
        const bug = await getBugId(id);

        if(bug) {
            res.status(200).json(bug);
            return;
        } else {
            res.status(404).send('Bug not found')
        }
    } catch  (error) {
        console.error("Error retrieving bug by ID:", error);
        res.status(500).json({ message: 'Error retrieving bug.' });
    }

});

router.post('/new', isAuthenticated, hasPermission("canCreateBug"),validate(addBugSchema),async(req,res) => {
    try {
        const newBug = req.body;
        const author = req.user;

        if(!author) return res.status(400).json({message: 'Author not found'})
        if(!newBug.title) return res.status(400).json({message: 'Title is required'});
        if(!newBug.description) return res.status(400).json({message: 'Description is required'});
        if(!newBug.stepsToReproduce) return res.status(400).json({message: 'Steps to Reproduce is required'});

       
        newBug.authorOfBug = `${author.givenName} ${author.familyName}`;
        newBug.createdOn = new Date(Date.now());
        newBug.classification = 'unclassified';
        newBug.closed = false;
        newBug.lastUpdated = new Date(Date.now());
        newBug.edits = [];
        newBug.comments = [];
        newBug.classifiedOn = null;
        newBug.assignedToUserName = null;
        newBug.assignedToUserId = null;
        newBug.testCases = [];
        newBug.workHoursLogged = []
        newBug.fixInVersion = null;
        newBug.fixedOnDate = null;
        newBug.closedOn= null;
      
 
        const result = await addedBug(newBug);
        debugBug(result)
        await updateUserCreatedBugs(author.id, newBug.title);
        const log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'insert',
            target: result.insertedId,
            performedBy: author.email
        }
        await saveAuditLog(log)
         if(result.insertedId){
            res.status(201).json({message: `Bug "${newBug.title}" added successfully`})
        }else {
            res.status(404).json({message: "Error adding a Bug."})
        }

    } catch (error) {
        console.error("Error adding bug:", error);
        res.status(500).json({ message: "Error adding a Bug." });
    }
});

router.patch('/:bugId', isAuthenticated, hasPermission(["canEditAnyBug","canEditIfAssignedTo","canEditMyBug"]), validId('bugId'), validate(updateBugSchema), async(req,res) => {
    try {
        const id = req.params.bugId;
        const oldBug = await getBugId(id);
        const bugToUpdate = req.body;
        if(!oldBug) {
            res.status(400).json({message: `Bug ${id} not found`});
            return;
        }
        
        const author = req.user;
        const authorId = author.id;
        
        if(!author) return res.status(400).json({message: 'Author not found'})

         let log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'update',
            target: id,
            update: [],
            performedBy: author.email
        }
       
        let title;
        let description;
        let stepsToReproduce
        if(bugToUpdate.title && bugToUpdate. title !== oldBug.title){
            title = bugToUpdate.title;
            log.update.push({field: "title", oldValue: oldBug.title, newValue: bugToUpdate.title});
        } else{
            title = oldBug.title
        }
        if(bugToUpdate.description && bugToUpdate.description !== oldBug.description){
            description = bugToUpdate.description;
            log.update.push({field: "description", oldValue: oldBug.description, newValue: bugToUpdate.description});
        } else{
            description = oldBug.description
        }
        if(bugToUpdate.stepsToReproduce && bugToUpdate.stepsToReproduce !== oldBug.stepsToReproduce){
            stepsToReproduce = bugToUpdate.stepsToReproduce;
            log.update.push({field: "stepsToReproduce", oldValue: oldBug.stepsToReproduce, newValue: bugToUpdate.stepsToReproduce});
        }else {
            stepsToReproduce = oldBug.stepsToReproduce
        }

        const updatedBug = await getUpdatedBug(id, title, stepsToReproduce, description, authorId);
        debugBug(updatedBug)
       
        await saveAuditLog(log)

        if(updatedBug.modifiedCount === 1){
            res.status(200).send(`Bug ${id} updated successfully`)
        } else {
            res.status(404).send(`Bug not found.`)
        }

    } catch (error){
        console.error("Error updating bug:", error);
        res.status(500).send(`Error updating bug.`);
    }
});

router.patch('/:bugId/classify', isAuthenticated, hasPermission('canClassifyAnyBug'),validId('bugId'), validate(classifyBugSchema),async(req,res) => {
    try{
        const id = req.params.bugId;
        const bugToUpdate = req.body
        const oldBug = await getBugId(id)

        if(!oldBug) {
            res.status(400).json({message: `Bug ${id} not found`});
            return;
        }

        const author = req.user;
        const authorId = author.id;
        if(!author) return res.status(400).json({message: 'Author not found'});

        let log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'update',
            target: id,
            update: [],
            performedBy: author.email
        }
        let classification;
        if(bugToUpdate.classification && bugToUpdate.classification !== oldBug.classification){
            classification = bugToUpdate.classification;
            log.update.push({field: "classification", oldValue: oldBug.classification, newValue: bugToUpdate.classification});
        } else{
            classification = oldBug.classification
        }
    
        const result = await classifyBug(id, classification, authorId);
        debugBug(result);
        await saveAuditLog(log)

        if(result.matchedCount === 0){
            res.status(404).json({message: `Bug not found or classification unchanged.`})
        }else{
            res.status(200).json({message: `Bug ${id} classified`})
        }

    } catch (error) {
        console.error("Error classifying bug:", error);
        res.status(500).json({ message: `Error classifying bug.` });
    }
});

router.patch('/:bugId/assign', isAuthenticated, hasPermission(['canReassignAnyBug', 'canReassignIfAssignedTo']),validId('bugId'), validate(assignBugSchema),async(req,res) => {
    try {
       const id = req.params.bugId;
       const {assignedToUserId} = req.body;
       const oldBug = await getBugId(id)
       if(!oldBug) {
            res.status(400).json({message: `Bug ${id} not found`});
            return;
        }
        const author = req.user;
        const authorId = author.id;
        if(!author) return res.status(400).json({message: 'Author not found'})
        
        const assignToUser = await getUserById(assignedToUserId)
        if(!assignToUser){
            return res.status(404).json({message: `User not Found`})
        }

        debugBug(assignToUser)

        let log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'update',
            target: id,
            update: [],
            performedBy: author.email
        }
        if(assignedToUserId && assignedToUserId !== oldBug.assignedToUserId){
            log.update.push({field: "assignToUserId", oldValue: oldBug.assignedToUserId, newValue: assignedToUserId});
        }
       const result = await assignBug(id, assignToUser._id, assignToUser.fullName, authorId)
       await saveAuditLog(log)
       debugBug(result)

       if(result.modifiedCount === 0 ){
         return res.status(404).json({ message: `Bug not found.` });
       } 
        res.status(200).json({ message: `Bug ${id} assigned to ${assignToUser.fullName}` });
       
        
    } catch (error) {
        console.error("Error assigning bug:", error);
        res.status(500).json({ message: `Error assigning bug.` });
    }
});

router.patch('/:bugId/close', isAuthenticated, hasPermission('canCloseAnyBug'),validId('bugId'), validate(closeBugSchema), async(req,res) => {
    try{
        const id = req.params.bugId
        const bugToClose = req.body;
        const oldBug = await getBugId(id)
        if(!oldBug) {
            res.status(400).json({message: `Bug ${id} not found`});
            return;
        }

        const author = req.user;
        const authorId = author.id;
        if(!author) return res.status(400).json({message: 'Author not found'})
        
        if(!bugToClose.closed) return res.status(400).json({message: "To close the bug, the closed field must be 'true'. "})

        let log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'update',
            target: id,
            update: [{field: "closed", oldValue: oldBug.closed, newValue: true}],
            performedBy: author.email
        }

        const closedBug = await getClosedBug(id, authorId)

        await saveAuditLog(log)
        debugBug(closedBug);
        if (closedBug.modifiedCount === 0) {
            res.status(404).json({message: 'Bug not found'});
            return;
        }
    } catch (error) {
        console.error("Error closing bug:", error);
        res.status(500).json({ message: `Error closing bug` });
    }
});
export {router as bugRouter};


