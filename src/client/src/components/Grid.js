import React, { useState, useEffect } from 'react';
import '../resizable.css'
import '../grid-layout.css'
import { Responsive as ResponsiveGridLayout, ToolBox } from 'react-grid-layout'
import GridLayout  from 'react-grid-layout'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Grid(props) {

  const [layout, setLayout] = useState([])

  const authToken = ''

  const { projectId } = useParams()

  useEffect(() => {
    axios.get(
      `http://localhost:3001/api/projects/${projectId}/`,
      {headers: {Authorization: `Bearer ${authToken}`}}
    )
    .then(res => {
      setLayout(fromDatabase(res.data.tasks))
    }).catch(() => {
      props.redirect('/projects')
    })
  }, [])

  const fromDatabase = (layout) => {
    return layout.map((obj, i) => (
      {
        ...obj,
        i: i.toString(),
        w: 1,
        h: obj.length,
        y: obj.start_time,
        x: obj.day,
        maxW: 1
      }
    ))
  }

  const toDatabase = (layout) => {
    return layout.map(obj => (
      {
        _id: obj._id,
        length: obj.h,
        start_time: obj.y,
        day: obj.x,
        title: obj.title,
        description: obj.description,
        complete: obj.complete
      }
    ))
  }

  const updateDatabase = async (newLayout) => {
    return axios.put(
      `http://localhost:3001/api/projects/${projectId}/tasks/edit`,
      {tasks: toDatabase(newLayout)},
      {headers: {Authorization: `Bearer ${authToken}`}}
    )
    .then(() => {
      setLayout(newLayout)
    })
    .catch(() => {
      reDraw()
    })
  }

  const validate = (items) => {
    for(let item of items) {
      if (item.y + item.h > 24) {
        return false
      }
    }
    return true
  }

  const reDraw = () => {
    let lastKey = parseInt(layout[layout.length-1].i)
    let newLayout = layout.map((obj, i) => {
      obj.i = (parseInt(lastKey) + i + 1).toString()
      return {...obj}
    })
    setLayout(newLayout)
  }

  const stopDrag = (items) => {
    if(!validate(items)) {
      reDraw()
    } else {
      let newItems = items.map((item, i) => (
        {
          ...layout[i],
          ...item
        }
      ))
      updateDatabase(newItems)
    }
  }

  return (
    <GridLayout onResizeStop={stopDrag} onDragStop={stopDrag} verticalCompact={false} className="layout" cols={10} maxRows={24} rowHeight={50} width={2200}>
      {layout.map((grid, i) => (
        <div key={grid.i} data-grid={grid} >
          <JoeMama {...grid} />
        </div>
      ))}
    </GridLayout>
  )
}

function JoeMama(props) {
  return (
    <div style={{backgroundColor: props.complete ? 'grren': 'red' }}>
      <p>title: {props.title}</p>
      <p>description: {props.description}</p>
    </div>
  )
}