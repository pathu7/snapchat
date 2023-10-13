import React, { useEffect, useState } from 'react'
import { CONSTANTS } from "../config/Constants"
import axios from "axios"
import avatar6 from '../assets/images/avatar6.jpg'
import { Auth } from '../context/auth'
import "./Home.css"
import io from 'socket.io-client';

let socket;
const CONNECTION_PORT = "192.168.0.114:8007"

function Home({ ID }) {

  const { UserId, token } = Auth()
  const [userData, setUserData] = useState('')
  const [oldMessage, setOldMessage] = useState([])

  const [message, setMessage] = useState('')
  const [roomName, setRoomName] = useState('')
  const [messageList, setMessageList] = useState([]);
  const [receivemsg, setReceiveMsg] = useState(null)

  useEffect(() => {
    // console.log(ID);
    socket = io(CONNECTION_PORT)

    if (ID) {
      // console.log('fhjhgjghj',roomName);
      DisplayChat()
      connectedRoom()
      if (roomName) {
        oldMessageAPI()
      }
    }

  }, [ID, CONNECTION_PORT, roomName])

  const DisplayChat = () => {
    const URL_PATH = CONSTANTS.API_URL + `${ID}`
    // console.log('hiiiii',URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
      }
    }).then((response) => {
      if (response.data) {
        // console.log('response', response.data);
        response.data.profile = `http://192.168.0.114:9007/uploads/${response.data.profile}`
        setUserData(response.data)
      }


    }).catch((error) => {
      console.log('error', error);
    })
  }

  const oldMessageAPI = () => {
    // console.log(roomName);
    const URL_PATH = CONSTANTS.API_URL + `message/${roomName}`
    // console.log(URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
      }
    }).then((response) => {
      if (response.data) {
        // console.log(response.data);
        setOldMessage(response.data)
      }
    }).catch((error) => {
      console.log('error', error);
    })

  }

  const connectedRoom = () => {

    const URL_PATH = CONSTANTS.API_URL + `room/${ID}/${UserId}`
    // console.log(URL_PATH);
    return axios({
      url: URL_PATH,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': token
      }
    }).then((response) => {
      if (response.data) {
        // console.log(response.data);
        setRoomName(response.data._id)
        socket.emit("room", response.data._id)
        // setOldMessage(response.data)
      }
    }).catch((error) => {
      console.log('error', error);
    })


  }

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setReceiveMsg(data)
  //   })
  // })



  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((prevItems) => [...prevItems, data])
    })
    console.log(messageList);
  }, [socket])

  const sendMessage = async () => {
    // console.log('text:-', message + "  sender:-", UserId + "   receiver", ID);

    let messageContent = {
      room: roomName,
      content: {
        author: UserId,
        message: message
      }
    }

    console.log("before state", messageList);

    await socket.emit("send_message", messageContent)
    setMessageList((prevItems) => [...prevItems, messageContent.content])
    setMessage('')

    return
    const URL_PATH = CONSTANTS.API_URL + 'createmessage'
    let body = {
      roomID: roomName,
      senderId: UserId,
      receiverId: ID,
      text: message
    }
    console.log(body);
    // return
    return axios({
      url: URL_PATH,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // 'Access-Control-Allow-Origin': '*',
        'authorization': token
      },
      data: body

    }).then((response) => {
      setMessage('')
      console.log(response.data);

    }, (error) => {
      console.log(error);
    });

  }

  // useEffect(() => {

  //   console.log(messageList);
  // }, [messageList])
  // console.log(messageList);







  return (
    <div>

      {userData &&
        <>
          <div style={{ display: 'flex' }}>
            <img src={userData.profile ? userData.profile : avatar6} alt="img" style={{ height: "4rem", width: "4rem", borderRadius: '100%', margin: 'auto 0' }} />
            <h1>{userData.firstName} {userData.lastName}</h1>
          </div>
          <hr />
          <div className='chatContainer'>
            <div className='messages'>
              {oldMessage.map(oldmes => (
                <div className='messageContainer' key={oldmes._id} id={oldmes.senderId == UserId ? "You" : "Other"}>
                  {/* <h1>{oldmes.text}</h1> */}
                  <div className="messageIndividual">{oldmes.text}</div>
                  {/* <h1 style={{display:oldmes.author == userName && "none"}}>{oldmes.author}</h1> */}
                </div>
              ))}
              {/* {console.log("return+++", messageList)} */}
              {messageList.map(val => {
                return (
                  <div className='messageContainer' id={val.author == UserId ? "You" : "Other"}>
                    <div className='messageIndividual'>{val.message}</div>

                  </div>
                )
              })}
            </div>
            <div className="messageInputs">
              <input type="text" placeholder="Type your Message..." onChange={(e) => setMessage(e.target.value)} value={message} />
              <button onClick={sendMessage}>Send</button>
            </div>

          </div>
        </>}
    </div>
  )
}

export default Home