import express from 'express';
import debug from 'debug';
const router = express.Router();
import { addBugSchema, updateBugSchema, classifyBugSchema, assignBugSchema, closeBugSchema} from '../../validation/bugSchema.js';
import { getAllBugs,getBugIds, addedBug, getUpdatedBug, classifyBug, getUserById, assignBug, getClosedBug} from '../../database.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
//import { ObjectId } from 'mongodb';
const debugBug = debug('app:BugRouter');
router.use(express.json())
router.use(express.urlencoded({extended: false}));

router.get('', async(req, res) => {
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

router.get('/:bugId', validId('bugId'), async(req, res) => {
    try {
        const id = req.params.bugId;
        const bug = await getBugIds(id);

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

router.post('/new', validate(addBugSchema),async(req,res) => {
    try {
        const newBug= req.body;
        if(!newBug.title){
             res.status(400).type('text/plain').send('Title is required');
             return;
            }

         if(!newBug.description){
             res.status(400).type('text/plain').send('Description is required');
             return;
            }

         if(!newBug.stepsToReproduce){
             res.status(400).type('text/plain').send('Steps to Reproduce is required');
             return;
            }
        
        const result = await addedBug(newBug.title, newBug.stepsToReproduce, newBug.description);
        debugBug(result)
         if(result.insertedId){
            res.status(201).json({message: `Bug ${newBug.title} added successfully`})
        }else {
            res.status(404).json({message: "Error adding a Bug."})
        }

    } catch (error) {
        console.error("Error adding bug:", error);
        res.status(500).json({ message: "Error adding a Bug." });
    }


});

router.patch('/:bugId', validId('bugId'), validate(updateBugSchema), async(req,res) => {
    try {
        const id = req.params.bugId;
        const oldBug = await getBugIds(id);
        const bugToUpdate = req.body;

        let title = "";
        let stepsToReproduce = "";
        let description = "";


        if(!oldBug) {
            res.status(400).json({message: `Bug ${id} not found`});
            return;
        }

        if(!bugToUpdate.title){
            title = oldBug.title;
        } else {
            title = bugToUpdate.title;
        }

        if(!bugToUpdate.stepsToReproduce) {
            stepsToReproduce = oldBug.stepsToReproduce;
        } else {
            stepsToReproduce = bugToUpdate.stepsToReproduce;
        }

        if(!bugToUpdate.description){
            description = oldBug.description;
        } else {
            description = bugToUpdate.description;
        }

        const updatedBug = await getUpdatedBug(id, title, stepsToReproduce, description);
        debugBug(updatedBug)

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

router.patch('/:bugId/classify', validId('bugId'), validate(classifyBugSchema),async(req,res) => {
    try{
        const id = req.params.bugId;
        const bugToUpdate = req.body

        if(!bugToUpdate || !bugToUpdate.classification || bugToUpdate.classification.toString().trim() === '') {
            res.status(404).type('text/plain').json({message: `Invalid or missing classification`});
            return;
        }
        const classification = await classifyBug(id, bugToUpdate.classification);
        debugBug(classification);

        if(classification.matchedCount === 0){
            res.status(404).json({message: `Bug not found or classification unchanged.`})
        }else{
            res.status(200).json({message: `Bug ${id} classified`})
        }

    } catch (error) {
        console.error("Error classifying bug:", error);
        res.status(500).json({ message: `Error classifying bug.` });
    }
    

});

router.patch('/:bugId/assign', validId('bugId'), validate(assignBugSchema),async(req,res) => {
    try {
       const id = req.params.bugId;
       const {assignedToUserId } = req.body;

       const assignToUser = await getUserById(assignedToUserId);

       if(!assignToUser){
        return res.status(404).json({message: `User not Found`})
       }

       const result = await assignBug(id, assignedToUserId, assignToUser.fullName)
       debugBug(result)

       if(result.modifiedCount === 0 ){
         return res.status(404).json({ message: `Bug not found.` });
       } else {
        res.status(200).json({ message: `Bug ${id} assigned to ${assignToUser.fullName}` });
       }
        
    } catch (error) {
        console.error("Error assigning bug:", error);
        res.status(500).json({ message: `Error assigning bug.` });
    }
});

router.patch('/:bugId/close', validId('bugId'), validate(closeBugSchema), async(req,res) => {
    try{
        const id = req.params.bugId;
        const closed = req.body.closed;

        const closeBug = await getBugIds(id);

        if(!closeBug) {
            return res.status(404).json({message: `Bug not Found`})
        }

        const bugClosed = await getClosedBug(id, closed);
        debugBug(bugClosed);
        if (bugClosed.modifiedCount === 0) {
            res.status(404).json({message: 'Bug not found'});
            return;
        }
        if (closed == "true") {
            res.status(200).json({message: `Bug ${id} closed.`});
        }else {
            return res.status(404).json({message: 'Bug not closed'});
        }

    } catch (error) {
        console.error("Error closing bug:", error);
        res.status(500).json({ message: `Error closing bug` });
    }
});
export {router as bugRouter};


