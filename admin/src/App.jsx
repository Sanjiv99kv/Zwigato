import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { Toaster } from 'react-hot-toast'

const App = () => {
  const url = "http://localhost:4000"
  return (
    <div>
      <Toaster />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/add' element={<Add url={url} />}></Route>
          <Route path='/list' element={<List url={url} />}></Route>
          <Route path='/orders' element={<Orders url={url} />}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
