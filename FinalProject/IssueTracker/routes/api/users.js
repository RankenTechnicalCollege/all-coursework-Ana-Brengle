import express from 'express';
import { getUsers, addUser, getUserById, getUserByEmail, getUpdatedUser, getDeletedUser, saveAuditLog} from '../../database.js';
import bcrypt from 'bcrypt';
import { registerSchema, loginSchema, updateUserSchema } from '../../validation/userSchema.js';
import { hasRole } from '../../middleware/hasRole.js';
import { validate } from '../../middleware/joiValidator.js';
import { validId } from '../../middleware/validId.js';
import { isAuthenticated } from '../../middleware/isAuthenticated.js';
import debug from 'debug';
const debugUser = debug('app:User')
const router = express.Router();
router.use(express.json())
router.use(express.urlencoded({extended:false}));


router.get('', isAuthenticated, async (req, res) => {
    try {
        const {keywords, role, maxAge, minAge, sortBy } = req.query;
        
        const pageNum = parseInt(req.query.pageNum) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;
        const skip = (pageNum - 1) * pageSize;

        const filter = {};

        if(keywords) filter.$text = {$search: keywords};
        if (role) filter.role = role;

        if(minAge || maxAge) {
            const today = new Date();
            today.setHours(0,0,0,0);

            const dateFilter = {};
            if (maxAge) dateFilter.$gte = new Date(today.getTime() - maxAge * 24 * 60 * 60 * 1000);
            if (minAge) dateFilter.$lte = new Date(today.getTime() - minAge * 24 * 60 * 60 * 1000);

            filter.createdAt = dateFilter;
        }

        const sortOptions = {
            familyName: { familyName: 1, givenName: 1, createdAt: 1 },
            role: { role: 1, givenName: 1, familyName: 1, createdAt: 1 },
            newest: { createdAt: -1 },
            oldest: { createdAt: 1 },
            givenName: { givenName: 1, familyName: 1, createdAt: 1 }
        }
         const sort = sortOptions[sortBy] || sortOptions['givenName']



        const users = await getUsers(filter,pageSize,skip, sort)
        if(!users){
            res.status(400).json({message: "User not found"});
            return;
        } else{
             res.status(200).json(users);
             return;
        }
    } catch (error){
        console.error("Error loading users:", error);
        res.status(500).json({message: "Error uploading Users"})
    }
});

router.get('/:userId',isAuthenticated, validId('userId'), async (req, res) => { 
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

    }catch (error) {
        console.error("Error loading user:", error);
        res.status(500).json({message: "Error Uploading User Id"})
    }
});

// router.post('/register', validate(registerSchema), async (req,res) => {
//     try {
//         const newUser = req.body;

//         if(!newUser.email){
//             res.status(400).type('text/plain').send('Email is required');
//             return;
//         }

//         if(!newUser.password){
//             res.status(400).type('text/plain').send('Password is required');
//             return;
//         }

//         if(!newUser.givenName){
//             res.status(400).send('First name is required');
//             return;
//         }

//         if(!newUser.familyName){
//             res.status(400).send('Family name is required');
//             return;
//         }

//         if(!newUser.role){
//             res.status(400).send('Role is required');
//             return;
//         }
//         const hashPassword = await bcrypt.hash(newUser.password, 10 );
//         newUser.password = hashPassword;

//         const existingUser = await getUserByEmail(newUser.email);
//         if(existingUser) {
//             res.status(400).json({message: 'User already exists'});
//             return;
//         }

//         newUser.createdBugs = [];
//         newUser.assignedBugs = [];
//         newUser.createdAt = new Date();

//         const addedUser = await addUser(newUser);
//         debugUser(addedUser);

//         if(addedUser.insertedId){
//             res.status(201).json({message: `User ${newUser.givenName} added successfully`})
//             return;
//         }else {
//             res.status(404).json({message: "Error adding a User."})
//             return;
//         }
//     }
//     catch  (error){
//         console.error("Error adding user:", error);
//         res.status(500).json({message: "Error Adding User"})
//     }
// });

// router.post('/login',  validate(loginSchema),async (req, res) => {
//     try {
//         const user = req.body;

//          if(!user.email || !user.password){
//             res.status(400).send('Email and Password are required');
//             return;
//         } 
    
//             const existingUser = await getUserByEmail(user.email);
//             if(!existingUser){
//                 res.status(400).json({message: 'Invalid login credential provided. Please try again.'});
//                 return;

//             }
//             if (existingUser && await bcrypt.compare(user.password, existingUser.password)) {
//                 res.status(200).json({message: `Welcome back ${existingUser.givenName}`});
//                 return;

//             } else{
//                 res.status(400).json({message: `Invalid login credential provided. Please try again.`});
//                 return;
//             }
        
//     } catch (error) {
//         console.error("Error logging in user:", error);
//         res.status(500).json({message: "Invalid login credential provided. Please try again."})
//     }  
// });

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

        givenName = userToUpdate.givenName || prevUser.givenName;
        familyName = userToUpdate.familyName || prevUser.familyName;
        fullName = userToUpdate.fullName || `${givenName} ${familyName}`;
        role = userToUpdate.role || prevUser.role;

        const updatedUser = await getUpdatedUser(id, password, fullName,givenName,familyName,role);
        debugUser(updatedUser);
        if(updatedUser.modifiedCount === 1){
            res.status(200).send(`User ${id} updated successfully`)
        } else {
            res.status(404).send(`User not found.`)
        }

    } catch(error) {
        console.error("Error updating in user:", error);
        res.status(500).json({message: "Error Updating User"})
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
    } catch  (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({message: "Error Deleting User"})
    }
});

export {router as userRouter}