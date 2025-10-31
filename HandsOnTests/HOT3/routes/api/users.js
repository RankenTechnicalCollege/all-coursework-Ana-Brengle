import express from 'express';
import debug from 'debug';
import { validate, validId } from '../../middleware/validator.js';
import { registerUserSchema, loginUserSchema, updateUserSchema } from '../../validation/userSchema.js';
const debugUser = debug('app:User')
const router = express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}));

router.get("", async (req, res) =>{
    try{
        const users = await getUsers();
        if(!users){
            res.status(400).json({message: "User not found"});
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

router.get("/:userId", validId('userId'),async (req, res) =>{
    try{
        const userId = req.params.userId
        const user = await getUsers(userId)

        if(!user) {
            res.status(400).json(user);
            return;
        }
        res.status(200).json(user);

    } catch (error) {
        console.error("Error loading user:", error);
        res.status(500).json({message: "Error Uploading User Id"})
    }
})

router.get("/me", async (req, res) =>{
    try{
        

    } catch (error) {
        console.error("Error user not found:", error);
        res.status(500).json({message: "Error Finding User"})
    }
})

router.patch("/me", async (req, res) =>{
    try{
        

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({message: "Error Updating User"})
    }
})

export {router as userRouter}
