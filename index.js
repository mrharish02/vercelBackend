const express = require("express")
const MongoClient = require('mongodb').MongoClient
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser")
const port = process.env.PORT || 3001;
const url = "mongodb+srv://usersdatabase:FGBhXp36eG0fO0dy@cluster0.f4yku3x.mongodb.net/";

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());



// const db =;

app.post('/', async(req, res) => {
    // res.send('hello from login');
    // console.log(req.body)
    // res.json({status:'ok'})
    try {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to MongoDB server");

        const db = client.db("User-Data");
        const collection = db.collection("User-Details");

        const user = await collection.findOne({ email: req.body.email });

        if (user == null) {
            console.log("Credentials Not found");
            res.json({status:'nouser',user:false})
        } else if (req.body.password == user["password"]) {
            
                console.log("Verified");
                console.log(user);
                const token = jwt.sign({email:user.email,name:user.name},'thisissecuredtransmissionofpasswordsandusernameandnoonecanaccessitatanycostwhatsoeveritisconfidential',{expiresIn:'1h'})
                res.cookie('jwt',token,{httpOnly:true})
                res.json({status:'success',user:true})
        } else {
            console.log("Invalid Details");
            res.json({status:'invalid',user:false})
        }
        client.close();
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        res.json({status:'error',user:false})
    }
});

app.post('/register', async (req, res) => {
    try {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to the database");
        const db = client.db('User-Data');

        const userCollection = db.collection('User-Details');

        // Check if the email already exists in the database
        const existingUser = await userCollection.findOne({ email: req.body.email });
        if (existingUser) {
            console.log('Duplicate email found');
            return res.json({ status: 'emailpresentalready', error: 'Duplicate email' });
        }
        else{
            const user = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            };

            const createUserResult = await userCollection.insertOne(user);
            if (createUserResult) {
                console.log('User created');
                res.json({ status: 'usercreated', user: false });
            }
        }
    } catch (err) {
        console.error('Error creating user:', err);
        res.json({ status: 'error', error: 'Failed to create user' });
    }
});


app.post('/home', async(req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.json({ status: 404 });
    }
    try{
        const decoded = jwt.verify(token, 'thisissecuredtransmissionofpasswordsandusernameandnoonecanaccessitatanycostwhatsoeveritisconfidential');
        const id = decoded.email;
        console.log(id)
        todo = {
            userId:id,
            title:req.body.title,
            desc:req.body.desc,
        }
        console.log(todo)
        const client = new MongoClient(url,{ useNewUrlParser: true, useUnifiedTopology: true })
        await client.connect();
        console.log("Connected to the database");
        const db = client.db('User-Data');

        const toDos = db.collection('Todo-Details')
        const updateResult = await toDos.insertOne(todo)
        if(updateResult){
            console.log('todo created')
            res.json({status:'todocreated'})
        }
    }catch(err){
        res.json({status:'error',error:'Duplicate email'})
    }
});

app.get('/todos', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.json({ status: 404 });
    }
    try {
        const decoded = jwt.verify(token, 'thisissecuredtransmissionofpasswordsandusernameandnoonecanaccessitatanycostwhatsoeveritisconfidential');
        const userId = decoded.email;

        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to the database");
        const db = client.db('User-Data');

        const todos = await db.collection('Todo-Details').find({ userId: userId }).toArray();
        res.json({ status: 'success', todos: todos });
    } catch (err) {
        console.error("Error fetching todos:", err);
        res.json({ status: 'error', error: 'Failed to fetch todos' });
    }
});

app.delete('/todos/:title', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.json({ status: 404 });
    }
    try {
        const decoded = jwt.verify(token, 'thisissecuredtransmissionofpasswordsandusernameandnoonecanaccessitatanycostwhatsoeveritisconfidential');
        const userId = decoded.email;
        const todoTitle = req.params.title;

        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected to the database");
        const db = client.db('User-Data');

        const deleteResult = await db.collection('Todo-Details').deleteOne({ userId: userId, title: todoTitle });

        if (deleteResult.deletedCount === 1) {
            console.log(`Todo with title '${todoTitle}' deleted successfully.`);
            res.json({ status: 'success', message: `Todo with title '${todoTitle}' deleted successfully.` });
        } else {
            console.log(`Todo with title '${todoTitle}' not found.`);
            res.json({ status: 'error', error: `Todo with title '${todoTitle}' not found.` });
        }
    } catch (err) {
        console.error("Error deleting todo:", err);
        res.json({ status: 'error', error: 'Failed to delete todo' });
    }
});

app.post('/logout', (req, res) => {
  // Clear the JWT cookie by setting an empty value and an expired date
  res.clearCookie('jwt', { httpOnly: true, expires: new Date(0) });

  // Additional cleanup or logout actions, if any
  // For example, you can invalidate the JWT token on the server-side, if necessary

  // Send a response indicating successful logout
  res.json({ status: 'success', message: 'Logged out successfully' });
});


app.listen(port, () => {
    console.log("server is running "+port)
});