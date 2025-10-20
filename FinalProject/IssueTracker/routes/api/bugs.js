import express from 'express';

const router = express.Router();

import debug from 'debug';

import { addBugSchema, updateBugSchema, classifyBugSchema, assignBugSchema, closeBugSchema, addCommentSchema, addTestCaseSchema,updateTestCaseSchema } from '../../validation/bugSchema.js';
import { getAllBugs,getBugIds, addedBug, getUpdatedBug, classifyBug, getUserById, assignBug, getClosedBug, getBugComments, getCommentsId, addCommentToBug, getBugTests, getTestsId, addTestCase, getUpdatedTestCase, deleteTestCase  } from '../../database.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
//import { date } from 'joi';
import { ObjectId } from 'mongodb';

const debugBug = debug('app:BugRouter');

router.use(express.urlencoded({extended: false}));

router.get('', async(req, res) => {
    try{
        const {keywords, classification, minAge, maxAge, closed, page, limit, sortBy, order} = req.query;

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
            filter.createdAt = dateFilter;
        }


        const sortOptions = {
            newest: {createdAt: -1},
            oldest: {createdAt: 1},
            title: {title: 1, createdAt: -1},
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
        res.status(200).json({message: `Bug with id ${id} is requested`});

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
        
        const addBug = await addedBug(newBug.title, newBug.stepsToReproduce, newBug.description);
        debugBug(addBug)
         if(addBug.insertedId){
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
        }
        return res.status(404).json({message: 'Bug not closed'});

    } catch (error) {
        console.error("Error closing bug:", error);
        res.status(500).json({ message: `Error closing bug` });
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

    } catch (error){
        console.error("Bug not found and no comments for this bug:", error);
        res.status(500).json({ message: 'Bug not found and no comments for this bug.' });
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
   } catch (error){
      console.error("Bug not found and no comments for this bug:", error);
      res.status(500).json({ message: 'Bug not found and no comments for this bug.' });
   } 
});

router.post('/:bugId/comments', validate(addCommentSchema), validId('bugId'),async(req,res) => {
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
            commentAuthor: {
                id: bugAuthor._id,
                name: bugAuthor.fullName
            },
            text: newComment.text,
            createdAt: new Date(),
         };
    
        
        const addComment = await addCommentToBug(id, orderedComment)
        debugBug(addComment)
         if(addComment.modifiedCount === 1){
            res.status(202).json({message: `Comment added successfully.`})
            return;
        }else {
            res.status(404).json({message: "Error adding a comment to bug."})
        }

    } catch (error){
        console.error("Bug not found and no comments for this bug:", error);
        res.status(500).json({ message: 'Bug not found and no comments for this bug.' });
    }
});

router.get('/:bugId/tests', validId('bugId'), async(req,res) => {
    try{
        const id = req.params.bugId;
        const bug = await getBugIds(id);
        
        if(!bug) {
            res.status(400).json({message: 'Bug not found'});
            return;
        }
        
        const tests = await getBugTests(id);
        debugBug(tests);
        if(!tests){
            res.status(400).json({message: 'There are no Tests for this bug.'});
            return;
        }
        res.status(200).json(tests)
    } catch (error) {
        console.error("Bug not found and no tests for this bug:", error); 
        res.status(500).json({ message: 'Bug not found and no tests for this bug.' });
    }
});

router.get('/:bugId/tests/:testId', validId('bugId'), validId('testId') ,async(req,res) => {
    try {
        const id = req.params.bugId;
        const bug = await getBugIds(id);

        if(!bug) {
            res.status(400).json({message: 'Bug not found'});
            return;
        }
        const testId = req.params.testId;
        const tests = await getTestsId(id, testId)

        debugBug(tests)

        if(!tests) {
            res.status(400).json({message: 'Test Not Found.'});
            return;
        }
        res.status(200).json(tests)  
    } catch (error) {
        console.error("Error loading test case and bug:", error);
        res.status(500).json({ message: 'Error Loading Test Cases and Bugs.' });
    }

});

router.post('/:bugId/tests', validId('bugId'), validate(addTestCaseSchema), async(req,res) => {
    try{
        const {authorId, title, status} = req.body;
        const id = req.params.bugId;


        const bug = await getBugIds(id)
        if(!bug) {
             res.status(400).json({message: 'Bug not found'});
            return;
        }

        const user = await getUserById(authorId);
        debugBug(user)
        if(!user) {
            res.status(400).json({message: 'User not found'});
            return;
        }
        if(user.role !== 'Quality Analyst') {
            return res.status(403).json({ message: 'Access denied. Only Quality Analysts can add test cases.' });
        }

        const testId = new ObjectId()
        const testCase = {
            testId: testId,
            title: title,
            status: status,
            testAuthor: {
                id: user._id,
                name: user.fullName
            },
            createdAt: new Date(),
            lastUpdated: new Date()
        };

        const addedTestCase = await addTestCase(id, testCase)
  
        if (addedTestCase.modifiedCount === 0) {
            res.status(404).json({message: 'Failed to add test to bug'});
            return;
        }

        //debugBug(addTestCase);
        res.status(200).json({ message: 'Test case added' });

    } catch (error) {
        console.error("Error adding test case:", error);
        res.status(500).json({ message: 'Error Adding Test Case to Bug.' });
    }
});

router.patch('/:bugId/tests/:testId', validId('bugId'), validId('testId'), validate(updateTestCaseSchema), async(req,res) =>{
    try {
        const id = req.params.bugId;
        const bug = await getBugIds(id);

        if(!bug) {
             res.status(400).json({message: 'Bug not found'});
            return;
        }
        const testId = req.params.testId;
        const updateTest = req.body;
        const oldTest = await getTestsId(id, testId);
        if (!oldTest) {
            res.status(404).json({ message: 'Test case not found' });
            return;
        }

        let status = updateTest.status ? updateTest.status : oldTest.status;
        let title = updateTest.title ? updateTest.title : oldTest.title;
        let testAuthor = {
            id: oldTest.testAuthor.id,
            name: oldTest.testAuthor.name
        };

        if(!updateTest.status){
            status = oldTest.status;
        } else {
            status = updateTest.status;
        }

        if(!updateTest.title){
            title = oldTest.title;
        } else {
            title = updateTest.title;
        }

        if (updateTest.testAuthor_id) {
            const user = await getUserById(updateTest.testAuthor_id);
            if (!user) {
                return res.status(400).json({ message: 'Test author not found' });
            }
            testAuthor = {
                id: user._id,
                name: user.fullName,
            };
        } else {
            testAuthor = oldTest.testAuthor;
        }

        const result = await getUpdatedTestCase(id, testId, title, testAuthor, status);
        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: 'Failed to update test case' });
        }

        res.status(200).json({ message: 'Test case updated successfully' });

    } catch  (error){
          console.error("Error updating test case:", error);
        res.status(500).json({ message: 'Error Updating Test Case.' });
    }
});

router.delete('/:bugId/tests/:testId', validId('bugId'), validId('testId'),async(req,res) =>{
    try {
        const id = req.params.bugId;
        const bug = await getBugIds(id);
        if (!bug) {
            res.status(404).json({message: 'Bug not found'});
            return;
        }
        const testId = req.params.testId;
        const testCaseToDelete = await getTestsId(id, testId);
        if (!testCaseToDelete) {
            res.status(404).json({message: 'Test case not found'});
            return;
        }
        const deleteTest = new ObjectId(testId);
        const deletedTestCase = await deleteTestCase(id, deleteTest);
        debugBug(deletedTestCase);
        if (deletedTestCase.modifiedCount === 0) {
            res.status(404).json({message: 'Bug or test case not found'});
            return;
        }
        res.status(200).json({message: `Test case ${testId} deleted successfully.`});
        
    } catch (error) {
        console.error("Error deleting test case:", error);
        res.status(500).json({ message: 'Error Deleting Test Case.' });
    }
});

export {router as bugRouter};


