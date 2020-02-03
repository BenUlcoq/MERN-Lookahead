import React, { useReducer } from "react"
import Nav from '../Nav'
import { Link, Redirect } from 'react-router-dom'
import { Button } from '@material-ui/core'
import axios from 'axios'
import LockIcon from '@material-ui/icons/Lock'
import ButtonInput from '../ButtonInput'
import FormInput from '../FormInput'
import TitleText from '../TitleText'
import NormalText from '../NormalText'
import CardContainer from '../CardContainer'
import Background from '../Background'


const Login = (props) => {

    const [data, setData] = useReducer((state, newState) => (
        {...state, ...newState}
    ), {
        email: '',
        password: ''
    })

    const onSubmit = e => {
        e.preventDefault()

        console.log(data)

        axios.post(
        'https://vast-oasis-18718.herokuapp.com/api/auth', data)
        .then(function (response) {
            console.log(response.status)
            props.redirect('/projects')
        })
        .catch(function (error) {
            console.log(error.response.data)
        })

    }

    const mystyle = {
        display: "flex",
        flexDirection: "column",
        alignitems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "10px",
        maxWidth: "400px",
        margin: "auto",
    }

    const buttonResetP = {
        color: "rgb(140, 140, 140)",
        margin: "30px 80px",
        fontSize: "8px"
    }

    const smallIcon= {
        width: "auto",
        height: "10px",
        margin: "4px"
    }

    const LoginPressed = ()  => {
        console.log("Login Pressed")
    }

    const ResetPressed = () => {
        console.log("Reset Pressed")
    }

    const onChange = e => setData({[e.target.name]: e.target.value})

    // Client Validation
    const email = (text) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)
    const password = (text) => text.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,1000}$/)

    let ButtonText = "Login"


    return (
        <>
        <Nav backButtonLink = "/" BackButton={true} MenuButton={false}/>
        <CardContainer background={Background}>
        <form onSubmit={onSubmit} className='form'>
        <div data-cy="loginView" style={mystyle}>
            <TitleText text="Login" />
            <NormalText text="Please enter your email and password" />

            <FormInput type='email' validation={email} value={data.email} onChange={onChange} require={true} errorText="Invalid Email" label='Email'  id='email' name='email' />
            <FormInput type='password' validation={password} value={data.password} onChange={onChange} require={true} errorText="Password Invalid" label='Password' id='password' name='password' />

            <ButtonInput onClick={LoginPressed} type='submit' primary={true} color='primary' text={ButtonText} />
            <Button component={Link} to="/account/password" onClick={ResetPressed} variant="outlined" style={buttonResetP}>Reset Password <LockIcon style={smallIcon} /> </Button>
        </div>
        </form>
        </CardContainer>
        <Background/>
        </>
    )
}

export default Login