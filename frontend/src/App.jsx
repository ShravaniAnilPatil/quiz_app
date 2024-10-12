import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import LoginPage from './pages/LoginPage';
import UserDashboard from './pages/UserDashboard';
import QuizPage from './pages/QuizPage';
import LevelSelection from './components/LevelSelection';
import ResultPage from './pages/ResultPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import CreateQuizForm from './pages/CreateQuizForm';

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<UserDashboard/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/level-selection" element={<LevelSelection/>}/>
      <Route path="/result" element={<ResultPage/>}/>
      <Route path="/quizpage" element={<QuizPage/>}/>
      <Route path='/profile' element={<ProfilePage/>}/>
      <Route path='/admin' element={<AdminDashboard/>}/>
      <Route path='/admin/create-quiz' element={<CreateQuizForm/>}/>


     
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
