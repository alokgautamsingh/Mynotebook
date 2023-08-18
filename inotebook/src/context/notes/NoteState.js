import React from "react";
import NoteContext from "./NoteContext";
import { useState } from "react";
const NoteState = (props)=>{
  const host = "http://localhost:5000"
   const notesinitial = []
  //   {
  //     "_id": "64db7694ad0e5d817c42959a",
  //     "user": "64db7650ad0e5d817c429598",
  //     "title": "MyTitle1",
  //     "description": " kam k  ro age badho  aur age badhoooo",
  //     "tag": "person  al",
  //     "date": "2023-08-15T12:59:00.458Z",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "64db7699ad0e5d817c42959c",
  //     "user": "64db7650ad0e5d817c429598",
  //     "title": "MyTitle2",
  //     "description": " kam k  ro age badho  aur afvdsgfhteftdteh alok champ hai tu ge badhoooo",
  //     "tag": "person  al",
  //     "date": "2023-08-15T12:59:05.779Z",
  //     "__v": 0
  //   }
  //  ]

  const [notes , setnotes] = useState(notesinitial)

     //fetch all notes

    
    const getNotes= async()=>{

      //api call
      
    const response = await fetch(`${host}/api/notes/fetchallnotes/`, {
      method: "GET",
     
      headers: {
        "Content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token')
      
      }
    
      

    });
    const json = await response.json();
    console.log(json);
     setnotes(json);
  }

  //  add a Note
    const addNote= async(title , description, tag)=>{

    //api call
      
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
     
      headers: {
        "Content-Type": "application/json",
        "auth-token":localStorage.getItem('token')
      
      },
    
      body: JSON.stringify({title,description,tag}), 
    });
     const note = await response.json(); 
     setnotes(notes.concat(note));
    }
    // const addNote = async (title, description, tag) => {
    //   // TODO: API Call
    //   // API Call 
    //   const response = await fetch(`${host}/api/notes/addnote`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       "auth-token": localStorage.getItem('token')
    //     },
    //     body: JSON.stringify({title, description, tag})
    //   });
  
    //   const note = await response.json();
    //   setnotes(notes.concat(note))
    // }
   //delete a note

   const deleteNote= async(id)=>{


    //api call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
     
      headers: {
        "Content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token')
      
      },
    
     
    });
    const json = response.json(); // parses JSON response into native JavaScript objects
     console.log(json);
     console.log("notes deleted for id" + id );
     const newNotes =  notes.filter((note)=>{
      return note._id!==id

     })
     setnotes(newNotes)
   }


   //update a note
   const editNote= async (id, title , description ,tag)=>{


    //Api call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
     
      headers: {
        "Content-Type": "application/json",
        "auth-token":
        localStorage.getItem('token')
      
      },
    
      body: JSON.stringify({title,description,tag}), 
    });
    const json = await response.json();
    console.log(json); // parses JSON response into native JavaScript objects
     let newNotes = JSON.parse(JSON.stringify(notes))
    //logic to edit
    for (let index = 0; index < newNotes.length; index++) {
      const element = notes[index];
      if(element._id===id)
      {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
      
    }
    setnotes(newNotes);

   }

  return(
    <NoteContext.Provider value ={{notes,addNote , deleteNote , editNote,getNotes}}>
        {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;