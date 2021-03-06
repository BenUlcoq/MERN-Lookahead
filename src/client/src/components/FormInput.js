import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles} from '@material-ui/core/styles'

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#C4C4C4',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField)

const FormInput = (props) => {

  const [valid, setValid] = useState(true)

  const validate = e => {
    props.onChange(e)
    props.validation && setValid(props.validation(e.target.value))
  }

  if (props.multiline) {
    return(
      <CssTextField
        style={{margin: "4px", width: "100%"}}
        required={props.require? true : undefined}
        error={!valid}
        name={props.name}
        multiline
        rows="4"
        id={`${props.id} ${valid ? "outlined" : "outlined-error-helper-text"}`}
        label={valid ? props.label : "Error"}
        helperText={!valid ? `${props.errorText}` : undefined}
        type={props.type || 'text'}
        variant="outlined"
        size="small"
        onChange={validate}
        value={props.value}
      />
    )
  } else {
  return(
    <CssTextField
      style={{margin: "4px", width: "100%"}}
      required={props.require? true : undefined}
      error={!valid}
      name={props.name}
      id={`${props.id} ${valid ? "outlined" : "outlined-error-helper-text"}`}
      label={valid ? props.label : "Error"}
      helperText={!valid ? `${props.errorText}` : undefined}
      type={props.type || 'text'}
      variant="outlined"
      size="small"
      onChange={validate}
      value={props.value}
    />
  )}
}

export default FormInput

