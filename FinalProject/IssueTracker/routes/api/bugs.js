import express from 'express';

const router = express.Router();

import debug from 'debug';

const debugBug = debug('app:BugRouter');

router.use(express.urlencoded({extended: false}));

import { getAllBugs,getBugIds, addedBug, getUpdatedBug, classifyBug, getUserById, assignBug, getClosedBug  } from '../../database.js';

// const bugs = [
//      { id: 1, title: 'Login button not responsive', description: 'The login button does not respond when clicked on mobile devices.', stepsToReproduce: '1. Open app on mobile device\n2. Navigate to login page\n3. Tap login button\n4. No action occurs', classification: 'approved', classifiedOn: null, lastUpdated: new Date(Date.now()), assignedToUserName: null, assignedToUserId: null, assignedOn: null, closed: false, closedOn: null},
//      { id: 2, title: 'Incorrect total price in cart', description: 'The total price in the shopping cart does not include tax.', stepsToReproduce: '1. Add items to cart\n2. View total price\n3. Notice tax is missing',  classification: 'unapproved', classifiedOn: null, lastUpdated: new Date(Date.now()), assignedToUserName: null, assignedToUserId: null, assignedOn: null, closed: false, closedOn: null },
//      { id: 3, title: 'Notification emails not sent', description: 'Users do not receive notification emails after password reset.', stepsToReproduce: '1. Request password reset\n2. Complete reset\n3. No notification email received',  classification: 'Duplicate', classifiedOn: null, lastUpdated: new Date(Date.now()), assignedToUserName: null, assignedToUserId: null, assignedOn: null, closed: false, closedOn: null }
// ];

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
    // debugBug('bug list route hit');
    // res.json(bugs);
});

router.get('/:bugId', async(req, res) => {
    try {
        const id = req.params.bugId;
        const bug = getBugIds();

        if(bug) {
            res.status(200).json(bug);
        } else {
            res.status(404).send('Bug not found')
        }
        res.status(200).json({message: `Bug with id ${id} is requested`});

    } catch  {
         res.status(404).json({message: 'Bug not found'})
    }

});

router.post('/new', async(req,res) => {
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

router.patch('/:bugId', async(req,res) => {
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

router.patch('/:bugId/classify', async(req,res) => {
    try{
        const id = req.params.bugId;
        const bugToUpdate = req.body

        if(!bugToUpdate || bugToUpdate.classification.toString().trim() === '') {
            res.status(404).type('text/plain').json({message: `Invalid or missing classification`});
            return;
        }
        const classification = await classifyBug(id, bugToUpdate.classification);
        debugBug(classification);

        if(classification.modifiedCount === 0){
            res.status(404).json({message: `Bug not found.`})
        }else{
            res.status(200).json({message: `Bug ${id} classified`})
        }

    } catch{
        res.status(404).json({message: `Error classifying bug. `})
    }
    

});

router.patch('/:bugId/assign', async(req,res) => {
    try {
       const id = req.params.bugId;
       const {assignedToUserId }= req.body;

       const assignToUser = await getUserById(assignedToUserId);

       if(!assignToUser){
        return res.status(404).json({message: `User not Found`})
       }

       const result = await assignBug(id, assignedToUserId, assignToUser.fullName)

       if(result.modifiedCount === 0 ){
         return res.status(404).json({ message: `Bug not found.` });
       } else {
        res.status(200).json({ message: `Bug ${id} assigned to ${assignToUser.fullName}` });
       }
        
    } catch  {
        res.status(404).json({message: `Error assigning bug.`})
    }
    

    
});

router.patch('/:bugId/close', async(req,res) => {
    try{
        const id = req.params.bugId;
        const closed = req.body.closed;

        const closeBug = await getBugIds(id);

        if(!closeBug) {
            return res.status(404).json({message: `Bug not Found`})
        }

        const bugClosed = await getClosedBug(id, closed)

        if(bugClosed.modifiedCount > 0){
            return res.status(200).json({message: `Bug ${id} closed!`})
        } else {
            return res.status(400).json({message: `Bug not Closed`})
        }

    } catch{
        res.status(404).json({message: `Error closing bug`})
    }

   


});

export {router as bugRouter};


