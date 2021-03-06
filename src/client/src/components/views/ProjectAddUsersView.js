import React, { useState, useEffect } from "react";
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import UserCard from '../UserCard'
import Nav from '../Nav'
import Background from '../Background'
import Card from '@material-ui/core/Card'
import FormInput from '../FormInput'
import SearchIcon from '@material-ui/icons/Search'
import { useParams } from 'react-router-dom'
import API from "../../axios.config"
import SuccessMessage from '../SuccessMessage'

const mystyle = {
    display: "flex",
    flexDirection: "column",
    alignitems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#006EE2",
    padding: "10px",
    maxWidth: "400px",
    margin: "auto",
}

const smallIcon= {
    width: "auto",
    height: "16px",
    margin: "4px"
}

const buttonMain = {
    color: "#006EE2",
    margin: "6px",
    border: "1px solid #006EE2",
}

const page ={
    backgroundColor: "none",
    height: "120%",
    width: "100%",
    position: "absolute",
    flexDirection: "column",
    alignitems: "center",
    justifyContent: "center",
}

const CardStyle = {
    position: "sticky",
    margin: "20px",
    width: "90vw",
    height: "auto",
    maxWidth: "500px",
    alignSelf: "center",
    borderRadius: "25px",
    color: '#006EE2'
  }


export default function ProjectAddUsersView(props) {
    // For Success Message
    const [successMessage, setSuccessMessage] = useState(null)

    const { projectId } = useParams()

    const [users, setUsers] = useState([])

    useEffect(() => {
        API.get(`/api/projects/${projectId}/add_users`)
        .then(res => {
            setUsers(res.data.users)
        })
        .catch(function (error) {
      })
    }, [])

    const addUser = (userId) => {
        API.post(`/api/projects/${projectId}/users`, {user: userId, role: 'Read'})
        .then(res => {
            setUsers(users.filter(el => el._id !== userId))
            setSuccessMessage("User has been added to the project.")
        })
        .catch(function (error) {

      })
    }

    return (
        <>
        {successMessage && <SuccessMessage msg={successMessage} onClose={() => setSuccessMessage(null)} />}

        <Nav backButtonLink ={`/projects/${projectId}/users`} MenuButton={true} BackButton={true} />
        <div style={page}>



        <div data-cy="projectsView" style={mystyle}>

        <Card style={CardStyle}>
        <p style={{margin: "10px", fontWeight: "bold", fontSize: "40px"}}>Add Users to Project</p>

        </Card>

        {users.map(user => {
            return <UserCard key={user._id} user={user.firstName + ' ' + user.lastName}  userPosition={user.position} userEmail={user.email} onClick={() => addUser(user._id)}/>
        })}

        </div>
        </div>
        <Background/>
        </>
    )
}
