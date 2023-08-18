import React, { useState } from 'react'
import NoteContext from '../context/notes/NoteContext';
import { useContext } from 'react'
const AddNote = (props) => {
  const context = useContext(NoteContext);
  const { addNote } = context;
  const [note, setnote] = useState({ title: "", description: "", tag: "" });
  const handlechange = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setnote({ title: "", description: "", tag: "" })
    props.showAlert("Added successsfully", "success")
  }
  const onChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value })

  }
  return (

    <div className='container my-3'>
      <h1> Vomit out what you want to vomit</h1>
      <form className="my-3">

        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required />
        </div>
        <button disabled={note.title.length<5 || note.description.length<5}type="submit" className="btn btn-primary" onClick={handlechange}>Add note</button>
      </form>
    </div>

  )
}

export default AddNote
