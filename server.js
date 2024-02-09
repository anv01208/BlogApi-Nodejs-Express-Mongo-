
const express = require('express')
const app = express()
app.use(express.json())
const {connectToDb,getDb}= require('./db')
const PORT = 3000
var ObjectId = require('mongodb').ObjectId;
let db;


connectToDb((err) => {
    if(!err){
        app.listen(PORT,(err) =>{
            err ? console.log(err) : console.log(`Port : ${PORT}`);

        });
        db = getDb();
    }else{
        console.log(`DB connection error: ${err}`)
    }
});

const handleError = (res,error) =>{
    res.status(500).json({error})
}

app.get('/blogs',(req,res) => {
    const blogs = [];
    
    
    db
        .collection('blogs')
        .find()
        .sort({title:1})
        .forEach((blog)=> blogs.push(blog))
        .then(() =>{
            res
                .status(200)
                .json(blogs);
        })
        .catch(()=>handleError(res,"Something goes wrong..."))
        
        })

        

app.get('/blogs/:id',(req,res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(500).json({ error: 'Invalid ID format' });
        return;
      }
    else{
        const id = new ObjectId(req.params.id);
        db
        .collection('blogs')
        .findOne({_id : id})
        .then((doc) =>{
            res
                .status(200)
                .json(doc);
        })
        .catch(()=>handleError(res,"Something goes wrong..."))
    }
    
        
})
app.delete('/blogs/:id',(req,res) => {
    
    if (!ObjectId.isValid(req.params.id)) {
        res.status(500).json({ error: 'Invalid ID format' });
        return;
      }
    else{
        const id = new ObjectId(req.params.id);
        db
        .collection('blogs')
        .deleteOne({_id : id})
        .then((result) =>{
            res
                .status(200)
                .json(result);
        })
        .catch(()=>handleError(res,"Something goes wrong..."))
    }
})

app.post('/blogs', (req, res) => {
    const { title, author, body } = req.body;
  
    if (!title || !author || !body || typeof title !== 'string' ||
        typeof author !== 'string' || typeof body !== 'string') {
      return res.status(400).json({ msg: 'Invalid title, author, or body' });
    }
  
    const currentDate = new Date();
    const dateString = currentDate.toISOString();
  
    const blog = {
      title,
      author,
      body,
      date: dateString,
    };
  
    db.collection('blogs')
      .insertOne(blog)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((error) => {
        console.error('Error inserting blog:', error);
        res.status(500).json({ msg: 'Something went wrong' });
      });
  });
  

app.patch('/blogs/:id',(req,res) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.status(500).json({ error: 'Invalid ID format' });
        return;
      }
    else{
        const id = new ObjectId(req.params.id);
        db
        .collection('blogs')
        .updateOne({_id : id},{$set : req.body})
        .then((result) =>{
            res
                .status(200)
                .json(result);
        })
        .catch(()=>handleError(res,"Something goes wrong..."))
    }
})
