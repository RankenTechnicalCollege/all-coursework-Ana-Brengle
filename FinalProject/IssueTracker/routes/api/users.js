import express from 'express';
import { getUsers, addUser, getUserById, getUserByEmail, getUpdatedUser } from '../../database.js';
const router = express.Router();
import bcrypt, { compare } from 'bcrypt';

import debug from 'debug';

const debugUser = debug('app:User')

router.use(express.urlencoded({extended:false}));


/*const users = [
    {email: 'nina.thomas@example.com', password: 'CoralReef#58', givenName: 'Nina', familyName: 'Thomas', fullName: 'Nina Thomas', role: 'Developer', assignedBug: null, userId: 1, },
    {email: 'ryan.lee@example.com', password: 'MountEverest@89', givenName: 'Ryan', familyName: 'Lee', fullName: 'Ryan Lee', role: 'Business Analyst', assignedBug: null, userId: 2},
    {email: 'lisa.kim@example.com', password: 'CherryBlossom_14', givenName: 'Lisa', familyName: 'Kim', fullName: 'lisa Kim', role: 'Quality Analyst', assignedBug: null, userId: 3},
    {email: 'david.clark@example.com', password: 'JetStream!66', givenName: 'David', familyName: 'Clark', fullName: 'David Clark' , role: 'Technical Manager', assignedBug: null, userId: 4},
    {email: 'sophia.patel@example.com', password: 'GoldenHour*30', givenName: 'Sophia', familyName: 'Patel', fullName: 'Sophia Patel', role: 'Product Manager', assignedBug: null, userId: 5},
]*/

router.get('', async (req, res) => {

    try {
        const users = await getUsers()
        if(!users){
            res.status(400).json({message: "User not found"});
            return;
        } else{
             res.status(200).json(users);
        }
    } catch{
        res.status(404).json({message: "Error uploading Users"})
    }
    
   
});

router.get('/:userId', async (req, res) => {
    try{

        const id = req.params.userId;
        const user = await getUserById();

        if(user) {
        res.status(200).json(user);
        } else {
            res.status(404).send('User not found')
        }
        res.status(200).send(`User with id ${id} is requested`);

    }catch{
        res.status(404).json({message: `User ${userId} not found`});
    }
   
    
});

router.post('/register', async (req,res) => {
    try {
        const newUser = req.body;
        
        //debugUser(JSON.stringify(result))

        if(!newUser.email){
            res.status(400).type('text/plain').send('Email is required');
            return;
        }

        if(!newUser.password){
            res.status(400).type('text/plain').send('Password is required');
            return;
        }

        if(!newUser.givenName){
            res.status(400).send('First name is required');
            return;
        }

        if(!newUser.familyName){
            res.status(400).send('Family name is required');
            return;
        }

        if(!newUser.role){
            res.status(400).send('Role is required');
            return;
        }

        newUser.createdBugs = [];
        newUser.assignedBugs = [];
        newUser.password = await bcrypt.hash(newUser.password, 10);

        const existingUser = await getUserByEmail(newUser.email);
        if(existingUser) {
            res.status(400).json({message: 'User already exists'});
            return;
        }
        const today = new Date();
        newUser.createdAt = today.toLocaleDateString();


        const addedUser = await addUser(newUser);
        debugUser(addedUser);

        if(addUser.insertedId){
            res.status(201).json({message: `User ${newUser.givenName} added successfully`})
        }else {
            res.status(404).json({message: "Error adding a User."})
        }

    }
    catch  {
        res.status(404).json({message: "Error adding a User."})
    }
    
});

router.post('/login', async (req, res) => {
    try {
        const user = req.body;

         if(!user.email || !user.password){
            res.status(400).send('Email and Password are required');
            return;
        } else {
            const existingUser = await getUserByEmail(email);
            if(!existingUser){
                res.status(400).json({message: 'Invalid login credential provided. Please try again.'});

            }else if(await compare(user.password, existingUser.password)) {
                res.status(200).json({message: `Welcome back ${user.givenName}`});

            } else{
                res.status(400).json({message: `Invalid login credential provided. Please try again.`});
            }
        }

    } catch {

        res.status(400).json({message: `Invalid login credential provided. Please try again.`});
    }
       
});

router.patch('/:userId', async (req,res) => {
    try{

        const id = req.params.userId;
        const userToUpdate = req.body;
        const prevUser = await getUserById(id);

        let password = null;
        let fullName = null;
        let givenName = null;
        let familyName = null;
        let role = null;

        if(!prevUser) {
            res.status(400).json({message: `User ${userId} not found`});
        }

        if(!userToUpdate.password){
            password = prevUser.password
        } else {
            password = userToUpdate.password;
            password = await bcrypt.hash(updatedUser.password, 10)
        }

        if(!userToUpdate.givenName){
            givenName = prevUser.givenName;
        }else {
            givenName = userToUpdate.givenName;
        }

        if(!userToUpdate.familyName) {
            familyName = prevUser.familyName;
        }else {
            familyName = userToUpdate.familyName;
        }

        if(!userToUpdate.fullName) {
            fullName = prevUser.fullName;
        }else {
            fullName = userToUpdate.fullName;
        }

        if(!userToUpdate.role) {
            role = prevUser.role;
        }else {
            role = userToUpdate.role;
        }

        const updatedUser = await getUpdatedUser(id, password, fullName,givenName,familyName,role);
        debugUser(updatedUser);
        if(updatedUser.modifiedCount === 1){
            res.status(200).send(`User ${id} updated successfully`)
        } else {
            res.status(404).send(`User not found.`)
        }




    } catch{
        res.status(404).send(`User not found.`)
    }

    
});

router.delete('/:userId', async (req,res) => {
    try {
        const id = req.params.userId;
        const deletedUser = await getDeletedUser(id);
        debugUser(deletedUser);

        if(deletedUser.deletedCount == 1){
            res.status(200).json({message: `User ${id} deleted successfully`});
        } else {
            res.status(404).json({message: `User ${id} not found.`});
        }
    } catch  {
        res.status(404).json({message: 'Error deleting User'})
    }
});

export {router as userRouter}
//export {users as users}