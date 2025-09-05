import express from 'express';

const router = express.Router();

import debug from 'debug';
const debugUser = debug('app:User')

const users = [
    {userId: 1, username: 'user1', password: "password1"},
    {userId: 2, username: 'user2', password: "password2"},
    {userId: 3, username: 'user3', password: "password3"}
]

router.get('/list', (req, res) => {
    res.status(200).json(users);
});

router.get('/:userId', (req, res) => {
    const id =req.params.userId;
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
            res.status(400).send('Email is required');
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
        res.status(200).json({message: `User ${newUser.givenName} added successfully`});

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
            const searchUser = users.find(u => u.email == users.email && u.password == users.password);
            if(searchUser){
                res.status(200).json({message: 'User logged in successfully'});
            }else {
                res.status(401).send('Invalid credentials');
            }
        }
});

export {router as userRouter}