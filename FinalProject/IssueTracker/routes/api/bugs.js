import express from 'express';

const router = express.Router();

import debug from 'debug';

import { addBugSchema, updateBugSchema, classifyBugSchema, assignBugSchema, closeBugSchema, addCommentSchema } from '../../validation/bugSchema.js';
import { getAllBugs,getBugIds, addedBug, getUpdatedBug, classifyBug, getUserById, assignBug, getClosedBug, getBugComments, getCommentsId, addCommentToBug  } from '../../database.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
//import { date } from 'joi';
import { ObjectId } from 'mongodb';

const debugBug = debug('app:BugRouter');

router.use(express.urlencoded({extended: false}));

router.get('', async(req, res) => {
    try{
        const bugs = await getAllBugs();
        if(!bugs){
            res.status(400).json({message: "Bugs not Found"})
        } else {
            res.status(200).json(bugs)
        }
    }catch{
        res.status(400).json({message: 'Error loading bugs.'})
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
        res.status(200).json({message: `Bug with id ${id} is requested`});

    } catch  {
         res.status(404).json({message: 'Bug not found'})
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
        
        const addBug = await addedBug(newBug.title, newBug.stepsToReproduce, newBug.description);
        debugBug(addBug)
         if(addBug.insertedId){
            res.status(201).json({message: `Bug ${newBug.title} added successfully`})
        }else {
            res.status(404).json({message: "Error adding a Bug."})
        }

    } catch {
         res.status(404).json({message: "Error adding a Bug."})
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


    } catch {
        res.status(404).send(`Error updating bug .`)
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

    } catch{
        res.status(404).json({message: `Error classifying bug. `})
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
        
    } catch  {
        res.status(404).json({message: `Error assigning bug.`})
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
            
        }
            res.status(404).json({message: 'Bug not closed'});
        
            

    } catch{
        res.status(404).json({message: `Error closing bug`})
    }

   


});

router.get('/:bugId/comments', async(req,res) => {
   try {
        const id = req.params.bugId;
        const bug = await getBugIds(id);
        
        if(!bug) {
            res.status(400).json({message: 'Bug not found'});
            return;
        }
        
        const comments = await getBugComments(id);
        debugBug(comments);
        if(!comments){
            res.status(400).json({message: 'Bug not found and no comments for this bug.'});
            return;
        }
        res.status(200).json(comments)

    } catch  {
         res.status(404).json({message: 'Bug not found'})
    }
});

router.get('/:bugId/comments/:commentId', async(req, res) => {
   try {
     const id = req.params.bugId;
     const bug = await getBugIds(id);

    if(!bug) {
        res.status(400).json({message: 'Bug not found'});
        return;
    }
    const commentId = req.params.commentId;
    const comments = await getCommentsId(id, commentId)

    debugBug(comments)

    if(!comments) {
        res.status(400).json({message: 'Bug not found and no comments for this bug.'});
        return;
    }
    res.status(200).json(comments)
   } catch {
     res.status(404).json({message: 'Error loading Bug and Comments'})
   } 
});

router.post('/:bugId/comments', validate(addBugSchema), validId('bugId'),async(req,res) => {
    try {
        const id = req.params.bugId;
        const bug = await getBugIds(id)

        if(!bug) {
             res.status(400).json({message: 'Bug not found'});
            return;
        }
        const newComment = req.body
        const bugAuthor = await getUserById(newComment.authorId)

        if(!bugAuthor) {
            res.status(400).json({message: 'Author not found'});
            return;
        }
        const commentId = new ObjectId();
        const orderedComment = {
            commentId: commentId,
            authorId: newComment.authorId,
            text: newComment.text,
            createdAt: new Date(),
         };
    
        
        const addComment = await addCommentToBug(id, orderedComment)
        debugBug(addComment)
         if(addComment.modifiedCount === 1){
            res.status(201).json({message: `Comment added successfully.`})
            return;
        }else {
            res.status(404).json({message: "Error adding a comment to bug."})
        }

    } catch {
         res.status(500).json({message: "Error adding comment to bug."})
    }
});

export {router as bugRouter};


