import express from 'express';
const router = express.Router();
import debug from 'debug';
import { addTestCaseSchema,updateTestCaseSchema } from '../../validation/bugSchema.js';
import { getBugTests, getTestsId, addTestCase, getUpdatedTestCase, deleteTestCase  } from '../../database.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
import { ObjectId } from 'mongodb';
const debugTest = debug('app:TestRouter');
router.use(express.json())
router.use(express.urlencoded({extended: false}));

router.get('/:bugId/tests', validId('bugId'), async(req,res) => {
    try{
        const id = req.params.bugId;
        const bug = await getBugIds(id);
        
        if(!bug) {
            res.status(400).json({message: 'Bug not found'});
            return;
        }
        
        const tests = await getBugTests(id);
        debugTest(tests);
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

        debugTest(tests)

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
        debugTest(user)
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
            createdOn: new Date(),
            lastUpdated: new Date()
        };

        const addedTestCase = await addTestCase(id, testCase)
  
        if (addedTestCase.modifiedCount === 0) {
            res.status(404).json({message: 'Failed to add test to bug'});
            return;
        }

        debugTest(addTestCase);
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
        debugTest(deletedTestCase);
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
export{router as testRouter}
