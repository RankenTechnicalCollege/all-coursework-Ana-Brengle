import express from 'express';


const router = express.Router();

import debug from 'debug';


const debugBug = debug('app:BugRouter');

router.use(express.urlencoded({extended:false}));

const bugs = [
     { id: 1, title: 'Login button not responsive', description: 'The login button does not respond when clicked on mobile devices.', stepsToReproduce: '1. Open app on mobile device\n2. Navigate to login page\n3. Tap login button\n4. No action occurs', classification: 'UI', classifiedOn: null, lastUpdated: new Date(Date.now()), assignedToUserName: null, assignedToUserId: null, assignedOn: null, closed: false, closedOn: null},
     { id: 3, title: 'Incorrect total price in cart', description: 'The total price in the shopping cart does not include tax.', stepsToReproduce: '1. Add items to cart\n2. View total price\n3. Notice tax is missing',  classification: 'UI', classifiedOn: null, lastUpdated: new Date(Date.now()), assignedToUserName: null, assignedToUserId: null, assignedOn: null, closed: false, closedOn: null },
     { id: 4, title: 'Notification emails not sent', description: 'Users do not receive notification emails after password reset.', stepsToReproduce: '1. Request password reset\n2. Complete reset\n3. No notification email received',  classification: 'UI', classifiedOn: null, lastUpdated: new Date(Date.now()), assignedToUserName: null, assignedToUserId: null, assignedOn: null, closed: false, closedOn: null }
];

router.get('/list', (req, res) => {
    debugBug('bug list route hit');
    res.json(bugs);
});

router.get('/:bugId', (req, res) => {

     const id = req.params.bugId;

     const bug = bugs.find(b => b.id == id);
     if(bug) {
         res.status(200).json(bug);
     } else {
         res.status(404).send('Bug not found')
    }
});

router.post('/new', (req,res) => {
     const newBug = req.body;

     const searchBug = bugs.find(bug => bug.title === newBug.title);

     if(searchBug) {
         res.status(400).send('Bug already exists')
         return;
     }else {
          newBug.id = bugs.length + 1;

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

        
         bugs.push(newBug);
         res.status(200).type('text/plain').json({message: `New bug reported`});
     }

});

router.put('/:bugId', (req,res) => {
    const id = req.params.bugId;
    const bugToUpdate = bugs.find(b => b.id == id);

    const updatedBug = req.body;

    if(bugToUpdate) 
    {

        for(const key in updatedBug) {
            bugToUpdate[key] = updatedBug[key];
        }

        const index = bugs.findIndex(bug => bug.bugId == id);
        if(index != -1) {
            bugs[index] = bugToUpdate;
        }
        res.status(200).send(`Bug ${id} updated successfully`)
    } else {

        res.status(404).send(`Bug not found.`)

    }
});

router.put('/:bugId/classify', (req,res) => {
    const id = req.params.bugId;
    const bugToUpdate = bugs.find(b => b.id == id);

    const classification = req.body.classification;

    if(!classification || classification.toString().trim() === '') {
        res.status(404).type('text/plain').send(`Invalid or missing classification`);
        return;
    }
    
    const index = bugs.findIndex(bug => bug.id == id);

    if(index === -1) {
        res.status(404).type('text/plain').send(`Bug ${id} not found.`);
        return;
    }

    if(bugToUpdate) {

        bugs[index].classification = classification;
        bugs[index].classifiedOn = new Date().toISOString();
        bugs[index].lastUpdated = new Date().toISOString();

        res.status(200).type('text/plain').send('Bug classified!');
    } 

});

router.put('/:bugId/assign', (req,res) => {
    //const id = req.params.bugId;
    const index = bugs.findIndex(bug => bug.id == req.params.bugId);

    if(index === -1) {
        res.status(404).type('text/plain').send(`Bug not found.`);
        return;
    }
    

    const assignedId = req.body.assignedToUserId;
    if(!assignedId || assignedId.toString().trim() === '') {
        res.status(400).type('text/plain').send(`Invalid or missing User Id`);
        return;
    }

    const assignedName = req.body.assignedToUserName;
    if(!assignedName || assignedName.toString().trim() === '') {
        res.status(400).type('text/plain').send(`Invalid or missing User Name`);
        return;
    }

    bugs[index].assignedOn = new Date(Date.now());
    bugs[index].lastUpdated = new Date(Date.now());
    bugs[index].assignedToUserName = assignedName;
    bugs[index].assignedToUserId = assignedId;

    res.status(200).type('text/plain').send('Bug assigned');

    
});

router.put('/:bugId/close', (req,res) => {
    const index = bugs.findIndex(bug => bug.id == req.params.bugId);
    const closedBugs = req.body;

    if(index === -1) {
        res.status(404).type('text/plain').send(`Bug not found.`);
        return;
    }

    if(closedBugs == undefined) {
        return res.status(400).type('text/plain').send('Must be defined');
    }

    const closedBug = req.body.closed;
    debugBug(JSON.stringify(closedBug));
    //if(closedBug != 'false'){
    //     return res.status(400).type('text/plain').send('Invalid or missing closed (must be false)');
    // }

    if(closedBugs.closed != 'true') {
        return res.status(400).type('text/plain').send('Invalid or missing closed (must be true)');
    }

  bugs[index].closed = 'true';
  bugs[index].closedOn = new Date().toISOString();
  bugs[index].lastUpdated = new Date().toISOString();

  return res.status(200).type('text/plain').send('Bug closed!');



});

export {router as bugRouter};


