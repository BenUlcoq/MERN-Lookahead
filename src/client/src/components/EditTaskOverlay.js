import React, {useReducer} from "react"
import API from "../axios.config"
import CardContainer from './CardContainer'
import DateInput from './DateInput'
import ButtonInput from './ButtonInput'
import TitleText from './TitleText'
import NormalText from './NormalText'
import DurationPicker from './DurationPicker'
import TimePicker from './TimePicker'
import FormInput from './FormInput'


const EditTaskOverlay = (props) => {

    const [data, setData] = useReducer((state, newState) => (
        {...state, ...newState}
      ), {
        taskName: '',
        description: '',
        startDate: '',
        duration: ''
      })
    
      const onSubmit = e => {
        e.preventDefault()
    
        console.log(data)
    
        API.post(
        '/api/users', data)
        .then(function (response) {
            
            console.log(response)
        })
        .catch(function (error) {
            console.log(error.response.data)
        })
        
      }
    
      const onChange = e => {
        setData({[e.target.name]: e.target.value})
        console.log(data) 
        // setData({"location": location.value})
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
    
    // Client Validation
    const basic = (text) => text.length > 2

    return (
        <>
      <div style={{position: "absolute", zIndex: "6", height: "100vh", width: "100vw"}}>
      <CardContainer style={{zIndex: "6"}} >
      <form onSubmit={onSubmit} className='form'>
        <div data-cy="newProjectView" style={mystyle}>
            <TitleText text={ props.edit? ("Edit Task") : ("New Task")  } />
            <NormalText text="Please fill out all required fields" />
            <FormInput type='text' validation={basic} value={data.taskName} onChange={onChange} require={true} errorText="Please enter more Characters" label='Task Name' id='taskName' name='taskName' />
            <FormInput type='text' validation={basic} value={data.description} onChange={onChange} require={false} multiline={true} label='Task Description' id='description' name='description' />
            
            <DateInput label="Start Date" day={1} id="startDate" name='startDate'/>
            
            <TimePicker label="Start Time*" id="startTime" name='startTime' style={{width: "100%"}}/>
            <DurationPicker label="Duration (hours)*" id="duration" name='duration' style={{width: "100%"}}/>

            <ButtonInput disabled={false} type='submit' primary={true} color='primary' text={ props.edit? ("Save") : ("Create") } />
        </div>
        </form>
        </CardContainer>
        </div>
        <div className="blackOverlay" ></div>
        </>
       
    )
}

export default EditTaskOverlay