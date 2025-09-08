import express from 'express';
import {nanoid} from 'nanoid'
import { userArray } from './user.js';

const router = express.Router();

import debug from 'debug';
const debugBug = debug('app:bugRouter');

router.use(express.urlencoded({extended:false}));

const bugArray = [
    {title: "Login button not working", description: "The login button does nothing when clicked.", stepsToReproduce: ["Go to login page", "Enter valid credentials", "Click the login button"], id: nanoid()},
    {title: "Profile picture not saving", description: "Uploaded profile picture does not appear after saving.", stepsToReproduce: ["Navigate to profile settings", "Upload a new picture", "Click save"], id: nanoid()},
    {title: "Search returns duplicates", description: "Some results appear multiple times when searching.", stepsToReproduce: ["Go to search page", "Type in any query", "Check the results list"], id: nanoid()},
    {title: "Dark mode text unreadable", description: "Placeholder text is too light in dark mode.", stepsToReproduce: ["Enable dark mode", "Navigate to any form field", "Look at the placeholder text"], id: nanoid()},
    {title: "Mobile navbar overlaps footer", description: "Navbar covers footer content on small screens.", stepsToReproduce: ["Open site on mobile", "Scroll to bottom of the page", "Observe navbar overlapping footer"], id: nanoid()},
];


//--------------------------------Router Gets----------------------------

router.get('/list', (req,res) => {
    debugBug('bug list route hit')
    res.json(bugArray);
});

router.get("/:bugId", (req,res) =>{
    //reads the bugId from the URL and stores in a bar
    const bugId = req.params.bugId;

    const bug = bugArray.find(b => b.id == bugId )
    if(bug){
        res.status(200).json(bug);
    }else{
        res.status(404).send('Bug not found')
    }
});

//--------------------------------Router Posts---------------------------

router.post('/new', (req,res) =>{
    //Req object has a body prop that contains the data sent by client
    const newBug = req.body;
    if (!newBug.title) {
        res.status(400).type('text/plain').send('Title is required');
        return;
    }
    if (!newBug.description) {
        res.status(400).type('text/plain').send('Description is required');
        return;
    }
    if (!newBug.stepsToReproduce) {
        res.status(400).type('text/plain').send('Steps to reproduce are required');
        return;
    }

    // check if a bug with the same title already exists
    const search = bugArray.find(bug => bug.title === newBug.title);
    if (search !== undefined) {
        res.status(400).type('text/plain').send('Bug with this title already exists');
        return;
    }
    newBug.userId = nanoid();
    console.log(newBug)
    bugArray.push(newBug);
    res.status(200).json({message: `New Bug '${newBug.title}' Registered!`});
});

//--------------------------------Router Put---------------------------

router.put('/:bugId', (req,res) =>{
    const id = req.params.bugId; // sending data with params

    const bugToUpdate = bugArray.find(bug => bug.id == id);

    const updatedBug = req.body; // sending data with body

    if (bugToUpdate) {
        for (const key in updatedBug) {
            bugToUpdate[key] = updatedBug[key];
        }

        // save updated bug in the bugs array
        const index = bugArray.findIndex(bug => bug.id == id);
        if (index !== -1) {
            bugArray[index] = bugToUpdate;
        }

        res.status(200).send(`Bug ${id} updated successfully`);
    } else {
        res.status(404).send(`Bug not found`);
    }
});


router.put('/:bugId/classify', (req, res) => {
    const id = req.params.bugId; // param
    const bugToUpdate = bugArray.find(bug => bug.id == id);

    if (bugToUpdate) {
        // set new description from request body
        bugToUpdate.description = req.body.description;

        res.status(200).send(`Bug ${id} description updated successfully`);
    } else {
        res.status(404).send(`Bug not found`);
    }
});

router.put('/:bugId/assign', (req, res) => {
    const bugId = req.params.bugId;            // bug ID from URL
    const { userId } = req.body;               // user ID from request body

    // find bug
    const bug = bugArray.find(b => b.id === bugId);
    if (!bug) {
        return res.status(404).json({ error: "Bug not found" });
    }

    // find user
    const user = userArray.find(u => u.userId === userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // assign bug to user
    user.assignedBug = bugId;

    res.status(200).json({
        message: `Bug ${bugId} assigned to user ${userId}`,
        user
    });
});
router.put('/:bugId/close', (req,res) =>{
    const id = req.params.bugId;
    const index = bugArray.findIndex(bug => bug.bugId == id);

    if(index != -1){
        bugArray.splice(index,1);//start at index, remove one element
        res.status(200).send(`Bug ${id} deleteted succesfully`);
    }else{
        res.status(404).send(`Bug not found`)
    }
});
export {router as bugRouter}
