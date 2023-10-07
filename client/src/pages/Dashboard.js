import React, { useState, useEffect, useContext } from 'react'
import { CONSTANTS } from "../config/Constants"
import { Auth, AuthContext } from '../context/auth'
import Home from './Home'
import axios from "axios"
import avatar6 from '../assets/images/avatar6.jpg'

function Dashboard() {

  const { userId } = useContext(AuthContext)
  const { email } = Auth()
  const [users, setUsers] = useState([])
  const [personalDataID, setPersonalDataID] = useState(null)
  const [settings, setSettings] = useState(null)
  const [values, setValues] = useState({})
  const [images, setImages] = useState()


  useEffect(() => {
    getUsers()
    // console.log('gjhd',userId);
  }, [])

  const getUsers = () => {
    const URL_PATH = CONSTANTS.API_URL + `allusers/${userId}`
    // console.log(URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      // console.log('response', response);
      setUsers(response.data)
    }).catch((error) => {
      console.log('error', error);
    })
  }

  const logOut = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("Email")
    localStorage.removeItem("token")
    window.location.reload()
  }

  const personalData = (ID) => {
    setPersonalDataID(ID)
  }

  const DeactivateChat = (ID) => {
    const URL_PATH = CONSTANTS.API_URL + `delete/${ID}`
    // console.log(URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      console.log('response', response);
      logOut()
      // setUsers(response.data)
    }).catch((error) => {
      console.log('error', error);
    })
  }

  const Editdetails = () => {
    // setSettings(false)
    const URL_PATH = CONSTANTS.API_URL + `${userId}`
    // console.log('hiiiii',URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (response.data) {
        // response.data.profile = `http://192.168.0.103:9007/uploads/${response.data.profile}`
        setSettings(response.data)
        console.log(response.data);

      }


    }).catch((error) => {
      console.log('error', error);
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues(x => ({ ...x, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      const render = new FileReader()
      render.onloadend = () => {
        const base64image = render.result.split(',')[1]
        const base64ext = file.type.split('image/')[1]
        setImages({ Images: base64image, ext: `.${base64ext}` })
      }
      render.readAsDataURL(file)
    }
  }

  const submit = (e) => {
    e.preventDefault();
    const URL_PATH = CONSTANTS.API_URL + `Edit/${userId}`
    console.log(values);
    let body = {
      // _id: userId,
      profile: images ? images : settings.profile,
      firstName: values.firstName ? values.firstName : settings.firstName,
      lastName: values.lastName ? values.lastName : settings.lastName,
      email: values.email ? values.email : settings.email,
    }

    if(values.password){
      body.password = values.password
    }
    if(images){
      body.oldProfile = settings.profile
    }
    console.log(body);
    return axios({
      url: URL_PATH,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
      },
      data: body

    }).then((response) => {
      // console.log(response);
      // console.log(response.data);
      if(email !== body.email){
        localStorage.removeItem("userId")
        localStorage.removeItem("Email")
        localStorage.removeItem("token")
        window.location.reload()
      }
      
      window.location.href = '/'
    }, (error) => {
      console.log(error);
    });
  }

  console.log(settings);

  return (
    <div>
      <div style={{ width: "320px", border: "1px solid black", position: "fixed", height: "100%", overflowY: "auto" }}>
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-around' }}>
          <div >
            <h3>{email} </h3>
          </div>
          <button onClick={() => { Editdetails() }}>Edit</button>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <button type='button' style={{ fontSize: "0.8rem" }} onClick={() => { logOut() }}>logout</button>
            <button type='button' style={{ fontSize: "0.8rem" }} onClick={() => { DeactivateChat(userId) }}>Deactivate Chat</button>

          </div>
        </div>
        <div>
          {settings == null ?
            <div style={{ textAlign: 'center' }}>{
              users.map((user) => (
                <div key={user._id} style={{ border: '1px solid black', display: 'flex' }} onClick={() => { personalData(user._id) }}>
                  <img src={`http://192.168.0.114:9007/uploads/${user.profile}`} alt="img" style={{ height: "4rem", width: "4rem", borderRadius: '100%' }} />
                  <h5><a>{user.firstName} {user.lastName}</a></h5>
                </div>
              ))}
            </div> :
            <div>
              <button style={{ textAlign: 'left' }} onClick={() => { setSettings(null) }}>Go back</button>
              <form onSubmit={submit}>
                <div style={{ display: 'flex' }}>
                  <label>Profile: </label>
                  <img src={`http://192.168.0.114:9007/uploads/${settings.profile}`} style={{ height: "4rem", width: "4rem", borderRadius: '100%', margin: 'auto 0' }} />
                </div>
                <input type="file" onChange={(e) => { handleImageChange(e) }} /><br />
                <label>First Name: </label>
                <input type='text' minLength={3} name='firstName' onChange={(e) => { handleChange(e) }} value={values.firstName} defaultValue={settings.firstName} required /><br />
                <label>Last Name: </label>
                <input type='text' minLength={3} name='lastName' onChange={(e) => { handleChange(e) }} value={values.lastName} defaultValue={settings.lastName} required /><br />
                <label>Email: </label>
                <input type='email' name='email' onChange={(e) => { handleChange(e) }} value={values.email} defaultValue={settings.email} required /><br />
                <label>Password: </label>
                <input type='password' name='password' onChange={(e) => { handleChange(e) }} /><br />
                <button type='submit'>Submit</button>
              </form>
            </div>
          }
        </div>
      </div>


      <div style={{ marginLeft: "320px", border: "1px solid red", position: "relative" }}>
        <Home ID={personalDataID} />
      </div>
    </div>
  )
}

export default Dashboard