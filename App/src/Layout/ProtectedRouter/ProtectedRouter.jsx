import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'

const ProtectedRouter = () => {
  return (
    <div className="flex flex-col h-screen">

      <NavBar />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}

export default ProtectedRouter