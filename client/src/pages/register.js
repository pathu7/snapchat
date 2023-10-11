import { useState } from "react"
import { CONSTANTS } from "../config/Constants"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Register() {

    const [image, setImage] = useState({})
    const [fname, setFname] = useState()
    const [lname, setLname] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        if(file){
            const render = new FileReader()
            render.onloadend = () => {
                const base64Images = render.result.split(',')[1]
                const base64ext = file.type.split('image/')[1]
                setImage({Images: base64Images, ext: `.${base64ext}`} )
            }
            render.readAsDataURL(file)
        }
    }

    const submit = (e) => {
        e.preventDefault();
        console.log(fname, lname, email, password);
        const URL_PATH = CONSTANTS.API_URL + 'signup'
        let body = {
            profile: image,
            firstName: fname,
            lastName: lname,
            email: email,
            password: password
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
            },
            data: body

        }).then((response) => {
            console.log(response);
            console.log(response.data);
            window.location.href = '/'
        }, (error) => {
            console.log(error);
            // if (error.response.data.error == undefined) {
            //     alert(error.response.data.errors[0].message)
            // } else {

            //     alert(error.response.data.error)
            // }
        });
    }

    return (
        <>
            <form onSubmit={submit}>
                <label>Profile: </label>
                <input type="file" onChange={(e) => {handleImageChange(e)}} /><br />
                <label>First Name: </label>
                <input type='text' minLength={3} onChange={(e) => { setFname(e.target.value) }}  /><br />
                <label>Last Name: </label>
                <input type='text' minLength={3} onChange={(e) => { setLname(e.target.value) }}  /><br />
                <label>Email: </label>
                <input type='email' onChange={(e) => { setEmail(e.target.value) }}  /><br />
                <label>Password: </label>
                <input type='password' onChange={(e) => { setPassword(e.target.value) }}  /><br />
                <button type='submit'>Submit</button>
            </form>
            <br />
            <Link to={'/'}>
                <button>Login</button>
            </Link>
        </>
    )
}