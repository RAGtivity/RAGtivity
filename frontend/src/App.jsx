import { useState, useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import Main from './components/main/Main'
import DocumentWindow from './components/document/document_window'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Settings from './components/settings/setting'
import { BrowserRouter, Routes, Route } from 'react-router'

const BACKEND_ENDPOINT = import.meta.env.VITE_BACKEND_ENDPOINT || "http://localhost:4000"

function App() {
  const [loggedInEmail, setLoggedInEmail] = useState("")
  const [documents, setDocuments] = useState([])
  const [openDuplicatePopup, setOpenDuplicatePopup] = useState(false)

  // Load documents from database
  useEffect(() => {
    fetchDocuments()
  }, [loggedInEmail])

  // Fetch documents from database by user email
  async function fetchDocuments() {
    if (loggedInEmail != "") {
      let response = await fetch(BACKEND_ENDPOINT + "/documents?email=" + loggedInEmail)
      response = await response.json()

      let retrievedDocuments = response.documents
      
      const newDocuments = (retrievedDocuments || []).map((document, index) => ({
        id: Date.now() + index,
        filename: document.filename
      }))

      setDocuments(newDocuments)
    }
  }

  // Add documents to database
  const addDocuments = async (newFiles) => {
    const formData = new FormData()

    // Populate form data
    formData.append("email", loggedInEmail)
    newFiles.forEach(file =>
      formData.append("files", file)
    )
    // Send files to backend server
    let response = await fetch(BACKEND_ENDPOINT + "/documents", {
      method: "POST",
      body: formData 
    })

    if (!response.ok) {
      const err_text = await response.text()

      if (err_text == "FILENAME_EXISTS") {
        setOpenDuplicatePopup(true)
      }
    }
    // Refresh document list
    fetchDocuments()      
  };
  

  const removeDocument = async (index) => {
    const filenameToRemove = documents[index].filename
    const formData = new FormData()

    formData.append("email", loggedInEmail)
    formData.append("filename", filenameToRemove)
    
    const response = await fetch(BACKEND_ENDPOINT +"/delete_document", {
      method: "POST",
      body: formData
    })

    console.log(response)
    
    fetchDocuments()
  };


  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout loggedInEmail={loggedInEmail} documents={documents} removeDocument={removeDocument} openDuplicatePopup={openDuplicatePopup} setOpenDuplicatePopup={setOpenDuplicatePopup}/>}>
            <Route index element={<Main loggedInEmail={loggedInEmail} onAddDocuments={addDocuments}/>} />
            <Route path="documents" element={<DocumentWindow documents={documents} onRemoveDocument={removeDocument} onAddDocuments={addDocuments}/>} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="login" element={<Login setLoggedInEmail={setLoggedInEmail}/>} />
          <Route path="signup" element={<Signup />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App