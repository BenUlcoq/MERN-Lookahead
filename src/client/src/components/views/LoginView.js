import React, { useReducer, useState } from "react"
import Nav from '../Nav'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import API from "../../axios.config"
import LockIcon from '@material-ui/icons/Lock'
import ButtonInput from '../ButtonInput'
import FormInput from '../FormInput'
import TitleText from '../TitleText'
import NormalText from '../NormalText'
import CardContainer from '../CardContainer'
import Background from '../Background'
import Loader from '../Loader'
import ErrorMessage from '../ErrorMessage'

const Login = (props) => {

    // For Loading Animation
    const [loading, setLoading] = useState(false)

    // For Error Message
    const [errorMessage, setErrorMessage] = useState(null)

    // Login Data
    const [data, setData] = useReducer((state, newState) => (
        {...state, ...newState}
    ), {
        email: '',
        password: ''
    })

    // Form Submit to server
    const onSubmit = e => {
        e.preventDefault()

        // Sends login data
        API.post(
        '/api/auth', data)
        .then(function (response) {
            setLoading(false)
            if (response.status === 200) {
                props.redirect('/projects')
            }
        })
        .catch(function (error) {  
            console.log(error)

            setLoading(false)
            setErrorMessage(error.response.data)
        })

    }

    // Styling
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


    // Runs when Login Button is pressed
    const LoginPressed = ()  => {
        setLoading(true)
    }

    // Each change we change to login data to submit
    const onChange = e => setData({[e.target.name]: e.target.value})

    // Client Validation
    const email = (text) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(text)
    const password = (text) => text.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,1000}$/)

    let ButtonText = "Login"

    const isValid = () => {
        return !!email(data.email) && !!password(data.password)
    }


    return (
        <>
        {errorMessage && <ErrorMessage msg={errorMessage.message} onClose={() => setErrorMessage(null)} />}

        <Nav backButtonLink = "/" BackButton={true} MenuButton={false}/>

        <CardContainer background={Background}>
        <form onSubmit={onSubmit} className='form'>
        <div data-cy="loginView" style={mystyle}>
            <Loader style={{opacity: loading ? 1 : 0}} />
            <TitleText text="Login" />
            <NormalText text="Please enter your email and password" />

            <FormInput type='email' validation={email} value={data.email} onChange={onChange} require={true} errorText="Invalid Email" label='Email'  id='email' name='email' />
            <FormInput type='password' validation={password} value={data.password} onChange={onChange} require={true} errorText="Password Invalid" label='Password' id='password' name='password' />

            <ButtonInput onClick={LoginPressed} type='submit' primary={true} text={ButtonText} disabled={!isValid()} />
            <Button onClick={LoginPressed} component={Link} to="/account/password" variant="outlined" style={buttonResetP}>Reset Password <LockIcon style={smallIcon} /> </Button>

        </div>
        </form>
        </CardContainer>
        <Background/>
        </>
    )
}

export default Login