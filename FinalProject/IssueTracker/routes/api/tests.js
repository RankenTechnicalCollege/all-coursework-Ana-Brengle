import express from 'express';
import debug from 'debug';
const router = express.Router();
import { addTestCaseSchema,updateTestCaseSchema } from '../../validation/bugSchema.js';
import { getUserById,getBugId,getBugTests, getTestsId, addTestCase, getUpdatedTestCase, deleteTestCase, saveAuditLog  } from '../../database.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import { hasPermission } from '../../middleware/hasPermissions.js';
import { validId } from '../../middleware/validId.js';
import { validate } from '../../middleware/joiValidator.js';
import { ObjectId } from 'mongodb';
const debugTest = debug('app:TestRouter');
router.use(express.json())
router.use(express.urlencoded({extended: false}));


router.get('/:bugId/tests',isAuthenticated, hasPermission('canViewData'), validId('bugId'), async(req,res) => {
    try{
        const id = req.params.bugId;
        const bug = await getBugId(id);
        
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

router.get('/:bugId/tests/:testId', isAuthenticated, hasPermission('canViewData'), validId('bugId'), validId('testId') ,async(req,res) => {
    try {
        const id = req.params.bugId;
        const bug = await getBugId(id);

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

router.post('/:bugId/tests', isAuthenticated, hasPermission('canAddTestCase'), validId('bugId'), validate(addTestCaseSchema), async(req,res) => {
    try{
        const { title, status} = req.body;
        const id = req.params.bugId;
        const bug = await getBugId(id)
        if(!bug) {
             res.status(400).json({message: 'Bug not found'});
            return;
        }
        const userId = req.session.userId
        const user = await getUserById(userId);
        debugTest(user)
        if(!user) {
            res.status(400).json({message: 'User not found'});
            return;
        }
        

        const testId = new ObjectId()
        const testCase = {
            testId: testId,
            title: title,
            status: status,
            testAuthor: {
                id: user._id,
                name: `${user.givenName}`
            },
            createdOn: new Date(),
            lastUpdated: new Date()
        };
        const log = {
            timestamp: new Date(Date.now()),
            col: 'bug test',
            op: 'insert test case',
            target: id,
            performedBy: user.email
        }
        const addedTestCase = await addTestCase(id, testCase, user._id)
        await saveAuditLog(log)
  
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

router.patch('/:bugId/tests/:testId', isAuthenticated, hasPermission('canEditTestCase'), validId('bugId'), validId('testId'), validate(updateTestCaseSchema), async(req,res) =>{
    try {
        const id = req.params.bugId;
        const bug = await getBugId(id);
        
        if(!bug) return res.status(400).json({message: `Bug not found`});
        
        const author = req.user;
        if(!author) return res.status(400).json({message: 'Author not found'})
        const testId = req.params.testId;
        const updateTest = req.body;
        const oldTest = await getTestsId(id, testId);
        if (!oldTest) return res.status(404).json({ message: 'Test case not found' });

        
        let log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'update test case',
            target: id,
            update: [],
            performedBy: author.email
        }
        let title;
        let status;
        let testAuthor;
        if(updateTest.title && updateTest. title !== oldTest.title){
            title = updateTest.title;
            log.update.push({field: "title", oldValue: oldTest.title, newValue: updateTest.title});
        } else{
            title = oldTest.title
        }
        if(updateTest.status && updateTest.status !== oldTest.status){
            status = updateTest.status;
            log.update.push({field: "status", oldValue: oldTest.status, newValue: updateTest.status});
        } else{
            status = oldTest.status
        }
        testAuthor = {
            id: author.id,
            name: `${author.givenName} ${author.familyName}`
        }
        log.update.push({field: "testAuthor", oldValue: oldTest.testAuthor, newValue: updateTest.testAuthor});

        const result = await getUpdatedTestCase(id, testId, title, testAuthor, status);
        await saveAuditLog(log);
        if (result.modifiedCount === 0) {
            return res.status(500).json({ message: 'Failed to update test case' });
        }
        res.status(200).json({ message: 'Test case updated' });
    } catch{
        console.error("Error updating test case:", error);
        res.status(500).json({ message: 'Error Updating Test Case.' });
    }
});

router.delete('/:bugId/tests/:testId', isAuthenticated, hasPermission('canDeleteTestCase'), validId('bugId'), validId('testId'),async(req,res) =>{
    try {
        const bugId = req.params.bugId;
        const bug = await getBugId(bugId)

        if(!bug) return res.status(400).json({message: "Bgg not found"});

        const author = req.user;
        if(!author) return res.status(400).json({message: "Author not found"});

        const testId = req.params.testId;
        const testCaseToDelete = await getTestsId(bugId, testId);
        if(!testCaseToDelete) return res.status(400).json({message: "Test case not found"});
        const deleteTest = new ObjectId(testId);

        let log = {
            timestamp: new Date(Date.now()),
            col: 'bug',
            op: 'delete test case',
            target: bugId,
            testId: testId,
            performedBy: author.email
        }
        const deletedTestCase = await deleteTestCase(bugId, deleteTest);
        debugTest(deletedTestCase);
        if (deletedTestCase.modifiedCount === 0) {
            res.status(404).json({message: 'Bug or test case not found'});
            return;
        }
        await saveAuditLog(log)
        res.status(200).json({message: `Test case ${testId} deleted successfully.`});



        
    } catch (error) {
        console.error("Error deleting test case:", error);
        res.status(500).json({ message: 'Error Deleting Test Case.' });
    }
});
export{router as testRouter}
