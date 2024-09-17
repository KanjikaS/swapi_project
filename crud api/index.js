const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
let users = [];


const seedUsers = () => {
    users = [];
    for (let i = 11; i <= 20; i++) {
        users.push({
            id: i,
            name: `User${i}`,
            email: `user${i}@example.com`,
        });
    }
};

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
});

app.post('/users', (req, res) => {
    const { name, email} = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name,
        email,
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.patch('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    const user = users.find(u => u.id === userId);
    // const updatedUser = {...user

    // }
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    if (email && email !== user.email) {
        return res.status(400).json({ message: "Email cannot be updated" });
    }
    if (name) {
        user.name = name;
    }

    res.json(user);
});



app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users.splice(userIndex, 1); 
    res.status(204).send();      
});

app.listen(PORT, () => {
    seedUsers(); 
    console.log(`Server is running on port ${PORT}`);
});
