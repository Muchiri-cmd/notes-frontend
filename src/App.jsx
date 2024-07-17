import { useState,useEffect } from "react";
import axios from 'axios'

import Note from './components/Note'
import noteService from './services/notes'


const App = () => {
  const [notes,setNotes] = useState(null)
  const [newNote,setNewNote] = useState('')
  const [showAll,setShowAll] = useState(true)
  const [errorMessage,setErrorMessage] = useState(null)

  // const hook = () => {
  //   console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(res => {
  //       console.log('promise fulfilled');
  //       setNotes(res.data)
  //     })
  // }
  // useEffect(hook,[])
  useEffect(()=>{
    // console.log('effect')

    // const eventHandler = res => {
    //     console.log('promise fulfilled');
    //     setNotes(res.data)
    // }

    // const promise = axios.get('http://localhost:3001/notes')
    // promise.then(eventHandler)
    noteService
      .getAll()
      .then(initialNotes => setNotes(initialNotes))
  },[])

  if (!notes)return null

  
  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important : Math.random() > 0.5
    }
    // axios
    //   .post('http://localhost:3001/notes',noteObject)
    //   .then(res => {
    //     console.log(res);
    //     setNotes(notes.concat(res.data))
    //     setNewNote('')
    //   })   
    noteService
      .create(noteObject)
      .then(returnedNote=>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)


  const toggleImportanceOf = (id) => {
      // console.log('importance of ' + id  +  'needs to be toggled');
      const url = `http://localhost:3001/notes/${id}`
      const note = notes.find(n=> n.id === id)
      const changedNote = { ...note,important:!note.important}

      // axios.put(url,changedNote)
      //   .then(res => setNotes(notes.map(n=> n.id !== id ? n : res.data)))

      noteService 
        .update(id,changedNote)
        .then(returnedNote => setNotes(notes.map(n=> n.id!==id ? n : returnedNote)))
        .catch(error => {
          setErrorMessage(
            `"${note.content}" does not exist in the server. Perhaps it was not saved or was wrongly entered`
          )
          setTimeout(()=>{
            setErrorMessage(null)
          },5000)
          // alert(
          //    `the note '${note.content}' was already deleted from server`
          // )
          setNotes(notes.filter(n => n.id !== id))
        })
  }

  const Notification = ({message}) => {
    if (message === null){
      return null
    }
    return (
      <div className="error">
        {message}
      </div>
    )


  }

  const Footer = () => {
    const footerStyle ={
      color:'green',
      fontStyle:'italic',
      fontSize:16
    }
    return (
      <div style={footerStyle}>
        <br />
        <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
      </div>
    )
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note}  toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
      <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form> 
      <Footer />
    </div>
  )
}

export default App