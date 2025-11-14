import express from 'express';
import debug from 'debug';
const debugUser = debug('app:User')
import {  isAuthenticated } from '../../middleware/isAuthenticated.js';
import { hasRole } from '../../middleware/hasRole.js';
import { getUserById, getUpdatedUser, getUsers, getAccount, updatePassword } from '../../database.js';
import { validate, validId } from '../../middleware/validator.js';
import {  updateUserSchema } from '../../validation/userSchema.js';
import { hashPassword } from 'better-auth/crypto';

const router = express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}));

router.get("",  isAuthenticated, hasRole('admin'),async (req, res) =>{
    try{

        const user = await getUsers();
        
        if(!user || user.length === 0){
            res.status(404).json({message: "User not found"});
            return;
        } else{
             res.status(200).json(user);
             return;
        }

    } catch (error) {
        console.error("Error loading users:", error);
        res.status(500).json({message: "Error uploading Users"})
    }
});

router.get("/me", isAuthenticated, async (req, res) =>{
    try{
     const user = await getUserById(req.session.userId);

        if(user) {
            res.status(200).json(user);
            return;
        } else {
            res.status(404).send('User not found')
            return;
        }

    } catch (error) {
        console.error("Error user not found:", error);
        res.status(500).json({message: "Error Finding User"})
    }
})

router.get("/:userId",  isAuthenticated, hasRole('admin'),validId('userId'), async (req, res) =>{
    try{
        const userId = req.params.userId
        const user = await getUserById(userId)

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



router.patch("/me", isAuthenticated, validate(updateUserSchema), async (req, res) =>{
    try{
        const userId = req.user.id;
        const oldUser = await getUserById(userId);
        if (!oldUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userToUpdate = req.body;
        const oldAccount = await getAccount(userId);
        if (!oldAccount) {
            return res.status(404).json({ message: 'Account not found' });
        }
        
       let fullName;
       let email;
       let password;

       if (userToUpdate.fullName) {
            fullName = userToUpdate.fullName;
        } else {
            fullName = oldUser.fullName;
        }
        if (userToUpdate.email) {
            email = userToUpdate.email;
        } else {
            email = oldUser.email;
        }
        if (userToUpdate.password) {
            password = userToUpdate.password;
        } else {
            password = oldAccount.password;
        }

        let finalPassword;
        if (password === oldAccount.password) {
            finalPassword = password;
        } else {
            finalPassword = await hashPassword(password);
        }

        const updatedUser = await getUpdatedUser(userId, fullName, email)
        debugUser(JSON.stringify(updatedUser))
        if(updatedUser.modifiedCount === 0){
            res.status(404).send(`User not updated.`)
        }
        const updatedPassword= await updatePassword(userId, finalPassword)
        debugUser(JSON.stringify(updatedPassword))  
        if(updatedPassword.modifiedCount === 0){
            res.status(404).send(`Password not updated.`)
        } 
        res.status(200).json({message: `User ${userId} updated successfully.`})

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Error Updating User"})
    }
})

export {router as userRouter}
