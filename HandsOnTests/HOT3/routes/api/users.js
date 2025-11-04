import express from 'express';
const router = express.Router();
import debug from 'debug';
const debugUser = debug('app:User')
import { hasRole } from '../../middleware/hasRole.js';

import { validate, validId } from '../../middleware/validator.js';
import {  updateUserSchema } from '../../validation/userSchema.js';
import {  isAuthenticated } from '../../middleware/isAuthenticated.js';
import { getUserById, getUpdatedUser, getUsers } from '../../database.js';


router.use(express.json())
router.use(express.urlencoded({extended:false}));

router.get("/", hasRole("admin"), async (req, res) =>{
    try{

        const users = await getUsers();
        
        if(!users || users.length === 0){
            res.status(404).json({message: "User not found"});
            return;
        } else{
             res.status(200).json(users);
             return;
        }

    } catch (error) {
        console.error("Error loading users:", error);
        res.status(500).json({message: "Error uploading Users"})
    }
})

router.get("/:userId", isAuthenticated, hasRole("admin"), validId('userId'), async (req, res) =>{
    try{
        const userId = req.params.userId
        const user = await getUsers(userId)

        if(!user) {
            res.status(404).json(user);
            return;
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error loading user:", error);
        res.status(500).json({message: "Error Uploading User Id"})
    }
})

router.get("/me", isAuthenticated,async (req, res) =>{
    try{

       const user = await getUserById(req.session.userId);

        if(user) return res.status(200).json(user);
        res.status(404).json({message: 'User not found'});

    } catch (error) {
        console.error("Error user not found:", error);
        res.status(500).json({message: "Error Finding User"})
    }
})

router.patch("/me", isAuthenticated, async (req, res) =>{
    try{
        const userId = req.user.id;
        const oldUser = await getUserById(userId);
        if (!oldUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const userToUpdate = req.body;
        let password;
        let email;
        let fullName;

        if(userToUpdate.password && userToUpdate.password !== oldUser.password){
            password = userToUpdate.password;
        } else{
            password = oldUser.password
        }

        if(userToUpdate.email && userToUpdate.email!== oldUser.email){
            email = userToUpdate.email;
        } else{
            email = oldUser.email
        }

        if(userToUpdate.fullName && userToUpdate.fullName!== oldUser.fullName){
            fullName = userToUpdate.fullName;
        } else{
            fullName = oldUser.fullName
        }
        const updatedUser = await getUpdatedUser(userId, fullName, email, password)
        debugUser(JSON.stringify(updatedUser))

        if(updatedUser.modifiedCount === 1){
            res.status(200).send(`User ${fullName} updated successfully`)
        } else {
            res.status(404).send(`User not updated.`)
        }

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Error Updating User"})
    }
})

export {router as userRouter}
