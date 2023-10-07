import React, {useEffect, useState} from 'react'
import { CONSTANTS } from "../config/Constants"
import axios from "axios"
import avatar6 from '../assets/images/avatar6.jpg'

function Home({ ID }) {

  const [userData, setUserData] = useState('')

  useEffect(() => {
    // console.log(ID);
    if(ID){
      DisplayChat()
    }
  },[ID])
  

  const DisplayChat = () => {

    const URL_PATH = CONSTANTS.API_URL + `${ID}`
    // console.log('hiiiii',URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if(response.data){
        // console.log('response', response.data);
        response.data.profile = `http://192.168.0.114:9007/uploads/${response.data.profile}`
        setUserData(response.data)
      }

      
    }).catch((error) => {
      console.log('error', error);
    })
  }

 


  
  return (
    <div style={{display:'flex'}}>
      
      {userData && 
      <>
      <img src={userData.profile ? userData.profile : avatar6 } alt="img" style={{ height: "4rem", width: "4rem", borderRadius: '100%', margin:'auto 0' }} />
      <h1>{userData.firstName} {userData.lastName}</h1>
      </>}
    </div>
  )
}

export default Home