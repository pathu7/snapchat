import React from 'react'

export let AuthContext = React.createContext(null);

function Auth() {
    const email = (localStorage.getItem('Email') || null)
  return {
    email
  }
}

export {Auth}