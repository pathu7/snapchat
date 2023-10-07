import { useState, useContext } from "react";
import { CONSTANTS } from "../config/Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { Link } from 'react-router-dom';

export default function Login() {

    const { login } = useContext(AuthContext)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const navigate = useNavigate()

    const submit = (e) => {
        // window.location.href = '/'
        e.preventDefault();
        console.log(email, password);
        const URL_PATH = CONSTANTS.API_URL + 'login'
        let body = {
            email: email,
            password: password
        }
        // return

        return axios({
            url: URL_PATH,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            data: body
        }).then((response) => {
            console.log(response);
            console.log(response.data);

            login({
                Token: response.data.token,
                UserId: response.data.ID,
                Email: response.data.Email
            })

            // localStorage.setItem('token','Bearer '+ response.data.token)
            // localStorage.setItem('userId',response.data.userId)
            // localStorage.setItem('Email',response.data.email)
            window.location.href = "/"
        }, (error) => {
            console.log(error);
            alert(error.response.data.message)
        });

    }
    return (
        <>
            <form onSubmit={submit}>
                <label>Email: </label>
                <input type='email' onChange={(e) => { setEmail(e.target.value) }} required /><br />
                <label>Password: </label>
                <input type='password' onChange={(e) => { setPassword(e.target.value) }} required /><br />
                <button type='submit'>Submit</button>
            </form>
            <br/>
            <Link to={'/Create'}>
            <button>Create You Account</button>
            </Link>

        </>
    )
}