import express from 'express';
import { getUsers, addUser, getUserById } from '../../database.js';
const router = express.Router();
import bcrypt from 'bcrypt';

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
        
        debugUser(JSON.stringify(result))

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

        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            res.status(400).send('User already exists')
            return;
        }

        const addUser = await addUser(newUser);


    }
        //users.push(newUser);
        //res.status(200).json({message: `User ${newUser.givenName} added successfully`});
        //const result = await addUser(newUser);   
    catch  {
        res.status(404).json({message: "Error adding a User."})
    }
    

    

    //const searchUser = users.find(user => user.email == newUser.email);

     
    
    // else {

    //     newUser.userId = users.length + 1;
        

    // }
});

router.post('/login', (req, res) => {
    const user = req.body;

    if(!user.email){
            res.status(400).send('Email is required');
            return;
        } else if(!user.password){
            res.status(400).send('Password is required');
            return;
        } else {
            const searchUser = users.find(u => u.email == user.email && u.password == user.password);
            if(searchUser){
                res.status(200).json({message: 'Welcome Back!'});
            }else {
                res.status(401).send('Invalid credentials');
            }
        }
});

router.put('/:userId', (req,res) => {
    const id = req.params.userId;
    const userToUpdate = users.find(user => user.userId == id);

    const updatedUser = req.body;

    if(userToUpdate) 
    {

        for(const key in updatedUser) {
            userToUpdate[key] = updatedUser[key];
        }

        const index = users.findIndex(user => user.userId == id);
        if(index != -1) {
            users[index] = userToUpdate;
        }
        res.status(200).send(`User ${id} updated successfully`)
    } else {

        res.status(404).send(`User not found.`)

    }

    
});

router.delete('/:userId', (req,res) => {
    const id = req.params.userId;
    const index = users.findIndex(user => user.userId == id);
    if(index !== 1) {
        users.splice(index,1);
        res.status(200).send(`User ${id} deleted successfully`);
    } else {
        res.status(400).send('User not found')
    }
});

export {router as userRouter}
//export {users as users}