import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<h1>Home</h1>} />
     
    </Routes>
    </BrowserRouter>
    <h1 className="text-3xl font-bold underline">
      Quiz app
    </h1>
    </>
  )
}

export default App
