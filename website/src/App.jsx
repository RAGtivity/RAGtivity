import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import Main from './components/main/Main'
import DocumentWindow from './components/document/document_window'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Settings from './components/settings/setting'
import { BrowserRouter, Routes, Route } from 'react-router'

function App() {
  const [loggedInEmail, setLoggedInEmail] = useState("")
  const [documents, setDocuments] = useState([])

  const addDocuments = async (newFiles) => {
    const formData = new FormData()
    const documentsWithDetails = newFiles.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
    }));

    // Populate form data
    formData.append("email", loggedInEmail)
    newFiles.forEach(file =>
      formData.append("files", file)
    )
    console.log(formData)
    // Send files to backend server
    await fetch("http://localhost:4000/documents", {
      method: "POST",
      body: formData 
    })

    setDocuments(prev => [...prev, ...documentsWithDetails]);
  };

  const removeDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };



  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout documents={documents} removeDocument={removeDocument} />}>
            <Route index element={<Main loggedInEmail={loggedInEmail} onAddDocuments={addDocuments}/>} />
            <Route path="/documents" element={<DocumentWindow documents={documents} onRemoveDocument={removeDocument} onAddDocuments={addDocuments}/>} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/login" element={<Login setLoggedInEmail={setLoggedInEmail}/>} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App