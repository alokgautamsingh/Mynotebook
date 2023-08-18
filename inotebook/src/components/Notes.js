import React from 'react'
import NoteContext from '../context/notes/NoteContext'
import { useContext, useEffect, useRef ,useState} from 'react'
import { useNavigate} from 'react-router-dom'
import Noteitem from './Noteitem';
import AddNote from './AddNote';
const Notes = (props) => {
  let navigate = useNavigate();
  const context = useContext(NoteContext);
  const { notes, getNotes,editNote } = context;
  useEffect(() => {
    if(localStorage.getItem('token'))
    {
      getNotes();
    }
    else
    {
      navigate("/login");
    }
    
  }, [])
  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setnote] = useState({ id:" ",etitle: "", edescription: "", etag: "" });
  const updateNote = (currentNote) => {
    ref.current.click();
    setnote({id: currentNote._id, etitle: currentNote.title ,  edescription :currentNote.description , etag :currentNote.tag})

  }
  
  const handlechange = (e) => {
    // e.preventDefault();
    refClose.current.click();
    editNote(note.id,note.etitle,note.edescription, note.etag)
    // // addNote(note.title, note.description, note.tag);
    // setnote({ etitle: "", edescription: "", etag: "" })
    props.showAlert("updated successfully ", "success")
  }
  const onChange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value })

  }
  return (
    <>
      <AddNote  showAlert={props.showAlert}/>

      <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Edit Your</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form className="my-3">

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" aria-describedby="emailHelp" value={note.etitle} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength={5} required />
                </div>
               
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" ref= {refClose}className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button  disabled={note.etitle.length<5 || note.edescription.length<5} type="button" onClick={handlechange}className="btn btn-primary">Update Note</button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h1> yours only </h1>
        <div className='container'>
        {notes.length===0 && 'No Notes to display'}
        </div>
        {
          notes.map((note) => {
            return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />;
          })}

      </div>
    </>
  )
}

export default Notes
