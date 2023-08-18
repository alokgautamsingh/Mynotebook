const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');


////// Route  1 : Get all the notes using Get /api/notes/fetchallnotes  Login required
router.get('/fetchallnotes', fetchuser,async (req,resp)=>{

    try {
        const notes = await Notes.find({user: req.user.id});

       resp.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server eroor");
    }
 
})


///Route 2 add a new note using  POST /api/notes/addnote  login requires
router.post('/addnote', fetchuser,[ 
    body('title' ,'Enter a valid title').isLength({min:3}),
    body('description' , 'Description must be atleast 5 charcters ').isLength({min :5}),
],async (req,resp)=>{


    try {
        
         const {title , description , tag} = req.body;
         const errors = validationResult(req);
         if(!errors.isEmpty())
         {
            return  res.status(400).json({errors : errors.array()});
         }
         const note = new Notes({
            title,description , tag , user: req.user.id
         })
            
         const savedNote = await note.save();
         resp.json(savedNote);
    } catch (error) {
        console.error(error.message);
        resp.status(500).send("Internal server eroor");
    }
    
})



/////Route 3 : update a note using PUT /api/notes/uodatenote     LOGIN REQUIRED
  router.put('/updatenote/:id', fetchuser , async (req,resp)=>{
    const {title , description ,tag} = req.body;
    try {
        //create a new  Note object
    const newNote = {};
    if(title) {newNote.title = title};
    if(description) {newNote.description = description};
    if(tag) {newNote.tag = tag};
    ///find the note to be updated

    let note = await Notes.findById(req.params.id);
    if(!note){
        return resp.status(404).send("NOt found")
    }
    if(note.user.toString()!== req.user.id)
    {
        return resp.status(401).send("Not allowed")
    }

    note = await Notes.findByIdAndUpdate(req.params.id ,{$set:newNote},{new:true});
    resp.json({note});
    } catch (error) {
        console.error(error.message);
        resp.status(500).send("Internal server eroor");
    }
    

  })
  /////Route $ : DElete a note using DELETE /api/notes/deletenote     LOGIN REQUIRED
  router.delete('/deletenote/:id', fetchuser , async (req,resp)=>{
 
   try {
     ///find the note to be deleted

     let note = await Notes.findById(req.params.id);
     if(!note){
         return resp.status(404).send("NOt found")
     }
 
     //match whether user is deleeting own note
     if(note.user.toString()!== req.user.id)
     {
         return res.status(401).send("Not allowed")
     }
 
     note = await Notes.findByIdAndDelete(req.params.id);
     resp.json({"Sicess": "NOte has been deleted ",note :note});
   } catch (error) {
    console.error(error.message);
        resp.status(500).send("Internal server eroor");
   }
   

  })
module.exports = router