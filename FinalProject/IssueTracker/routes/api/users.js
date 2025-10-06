import express from 'express';
import { getUsers, addUser, getUserById, getUserByEmail, getUpdatedUser, getDeletedUser} from '../../database.js';

import bcrypt from 'bcrypt';
import { registerSchema, loginSchema, updateUserSchema } from '../../validation/userSchema.js';
import { validate } from '../../middleware/joiValidator.js';
import { validId } from '../../middleware/validId.js';
import debug from 'debug';

const debugUser = debug('app:User')
const router = express.Router();

router.use(express.urlencoded({extended:false}));


router.get('', async (req, res) => {
    try {
        const users = await getUsers()
        if(!users){
            res.status(400).json({message: "User not found"});
            return;
        } else{
             res.status(200).json(users);
             return;
        }
    } catch{
        res.status(404).json({message: "Error uploading Users"})
    }
});

router.get('/:userId',validId('userId'), async (req, res) => { 
    try{
        const id = req.params.userId;
        const user = await getUserById(id);

        if(user) {
            res.status(200).json(user);
            return;
        } else {
            res.status(404).send('User not found')
            return;
        }

    }catch{
        res.status(404).json({message: `User ${id} not found`});
    }
});

router.post('/register', validate(registerSchema), async (req,res) => {
    try {
        const newUser = req.body;

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
        const hashPassword = await bcrypt.hash(newUser.password, 10 );
        newUser.password = hashPassword;

        const existingUser = await getUserByEmail(newUser.email);
        if(existingUser) {
            res.status(400).json({message: 'User already exists'});
            return;
        }

        newUser.createdBugs = [];
        newUser.assignedBugs = [];
        const today = new Date();
        newUser.createdAt = today.toLocaleDateString();


        const addedUser = await addUser(newUser);
        debugUser(addedUser);

        if(addedUser.insertedId){
            res.status(201).json({message: `User ${newUser.givenName} added successfully`})
            return;
        }else {
            res.status(404).json({message: "Error adding a User."})
            return;
        }
    }
    catch  {
        res.status(404).json({message: "Error adding a User."})
    }
});

router.post('/login', validate(loginSchema),async (req, res) => {
    try {
        const user = req.body;

         if(!user.email || !user.password){
            res.status(400).send('Email and Password are required');
            return;
        } 
    
            const existingUser = await getUserByEmail(user.email);
            if(!existingUser){
                res.status(400).json({message: 'Invalid login credential provided. Please try again.'});
                return;

            }
            if (existingUser && await bcrypt.compare(user.password, existingUser.password)) {
                res.status(200).json({message: `Welcome back ${existingUser.givenName}`});
                return;

            } else{
                res.status(400).json({message: `Invalid login credential provided. Please try again.`});
                return;
            }
        

    } catch {

        res.status(400).json({message: `Invalid login credential provided. Please try again.`});
    }  
});

router.patch('/:userId', validId('userId'), validate(updateUserSchema), async (req,res) => {
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
            res.status(400).json({message: `User ${id} not found`});
            return;
        }

        if(!userToUpdate.password){
            password = prevUser.password
        } else {
            password = userToUpdate.password;
            password = await bcrypt.hash(userToUpdate.password, 10)
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

router.delete('/:userId', validId('userId'), async (req,res) => {
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