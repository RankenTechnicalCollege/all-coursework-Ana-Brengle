import express from 'express';

const router = express.Router();

import debug from 'debug';

const debugUser = debug('app:User')

router.use(express.urlencoded({extended:false}));


const users = [
    {email: 'nina.thomas@example.com', password: 'CoralReef#58', givenName: 'Nina', familyName: 'Thomas', role: 'Teacher', assignedBug: null, userId: 1},
    {email: 'ryan.lee@example.com', password: 'MountEverest@89', givenName: 'Ryan', familyName: 'Lee', role: 'Admin', assignedBug: null, userId: 2},
    {email: 'lisa.kim@example.com', password: 'CherryBlossom_14', givenName: 'Lisa', familyName: 'Kim', role: 'Student', assignedBug: null, userId: 3},
    {email: 'david.clark@example.com', password: 'JetStream!66', givenName: 'David', familyName: 'Clark', role: 'Student', assignedBug: null, userId: 4},
    {email: 'sophia.patel@example.com', password: 'GoldenHour*30', givenName: 'Sophia', familyName: 'Patel', role: 'Teacher', assignedBug: null, userId: 5},
]

router.get('/list', (req, res) => {
    res.status(200).json(users);
});

router.get('/:userId', (req, res) => {
    const id = req.params.userId;
    //console.log(id);
    const user = users.find(user => user.userId == id);
    if(user) {
        res.status(200).json(user);
    } else {
        res.status(404).send('User not found')
    }
    res.status(200).send(`User with id ${id} is requested`);
});

router.post('/register', (req,res) => {

    const newUser = req.body;
    //debugUser(`New user email is : ${newUser.email}`)

    const searchUser = users.find(user => user.email == newUser.email);
    if(searchUser) {
        res.status(400).send('User already exists')
        return;
    } else {

    
    
        newUser.userId = users.length + 1;
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
        users.push(newUser);
        res.status(200).type('text/plain').json({message: `User ${newUser.givenName} added successfully`});

    }
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