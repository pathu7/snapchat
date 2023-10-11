import React from 'react'

export let AuthContext = React.createContext(null);

function Auth() {
    const email = (localStorage.getItem('Email') || null)
    const token = (localStorage.getItem('token') || null)
    const UserId = (localStorage.getItem('userId') || null)
  return {
    email,
    token,
    UserId
  }
}

export {Auth}