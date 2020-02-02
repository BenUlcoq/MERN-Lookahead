const { TaskSchema, validateTask } = require("../models/task")
const { ProjectModel } = require("../models/project")
const { UserModel } = require("../models/user")
const _ = require("lodash")

async function createTask(req, res) {

  let validUser = await UserModel.findById(req.user._id)
  .catch( (err) => { return res.status(404).json(error.details[0].message) })

  let task = req.body

  let validProject = await ProjectModel.findById((req.params.projectId))
  .catch( (err) => { return res.status(404).json(error.details[0].message) })

  if (!validProject) {
    return res.status(400).send("That project does not exist.")
  }

  let userInProject = validProject.users.find(
    element => element.user == validUser._id
  )

  if (
    validUser._id == String(validProject.owner) ||
    userInProject.role == "Write"
  ) {
    let projectDays =
      (validProject.end_date - validProject.start_date) / 1000 / 60 / 60 / 24
    
      const { error } = validateTask(task, projectDays)
    if (error) return res.status(400).send(error.details[0].message)

    checkOverlap(task, validProject)
    if (!checkOverlap) {
      return res.status(400).send("Tasks cannot overlap.")
    }

    if (task.start_time + task.length > 24) {
      let overlap = parseInt(task.start_time) + parseInt(task.length) - 24

      let splitTask = Object.assign({}, task)
      splitTask.length = overlap
      splitTask.day += 1

      task.length -= overlap

      validProject.tasks.push(task, splitTask)
      await validProject.save()

      res.status(201).json({ message: "Tasks successfully created." })
    } else {

      const { error } = validateTask(task, projectDays)
      if (error) return res.status(400).send(error.details[0].message)

      validProject.tasks.push(task)
      await validProject.save()

      res.status(201).json({ message: "Task successfully created." })
    }
  } else {
    res
      .status(401)
      .json({ message: "You're not authorized to edit this project." })
  }
}

async function updateTask(req, res) {
  let validUser = await UserModel.findById(req.user._id)
  .catch( (err) => { return res.status(404).json(error.details[0].message) })

  let validProject = await ProjectModel.findById((req.params.projectId))
  .catch( (err) => { return res.status(404).json(error.details[0].message) })

  let userInProject = validProject.users.find(
    element => element.user == validUser._id
  )

  if (
    validUser._id == String(validProject.owner) ||
    userInProject.role == "Write"
  ) {
    let validTask = validProject.tasks.find(
      val => (val._id = req.params.taskId)
    )

    let projectDays =
      (validProject.end_date - validProject.start_date) / 1000 / 60 / 60 / 24

    const { error } = validateTask(req.body, projectDays)
    if (error) return res.status(400).send(error.details[0].message)

    validTask.title = req.body.title
    validTask.start_time = req.body.start_time
    validTask.length = req.body.length
    validTask.day = req.body.day
    validTask.description = req.body.description

    checkOverlap(validTask, validProject)
    if (!checkOverlap) {
      return res.status(400).send("Tasks cannot overlap.")
    }

    await validProject.save()

    res.status(200).json({ message: "Task successfully updated." })
  } else {

    res
      .status(401)
      .json({ message: "You're not authorized to edit this project." })
  }
}

async function removeTask(req, res) {
  let validUser = await UserModel.findById(req.user._id)
  .catch( (err) => { return res.status(404).json(error.details[0].message) })

  let validProject = await ProjectModel.findById((req.params.projectId))
  .catch( (err) => { return res.status(404).json(error.details[0].message) })

  let userInProject = validProject.users.find(
    element => element.user == validUser._id
  )

  if (
    validUser._id == String(validProject.owner) ||
    userInProject.role == "Write"
  ) {
    const { error } = await validProject.tasks.pull(req.params.taskId)
    if (error) return res.status(400).end(error.details[0].message)

    await validProject.save()

    res.status(200).json({ message: "Task successfully deleted." })
  } else {
    res
      .status(401)
      .json({ message: "You're not authorized to edit this project." })
  }
}

function checkOverlap(task, project) {
  taskStart = new Date(0, 0, task.day, task.start_time)
  taskFinish = new Date(0, 0, task.day, task.start_time + task.length)

  for (let projTask of project.tasks) {
    projTaskStart = new Date(0, 0, projTask.day, projTask.start_time)
    projTaskFinish = new Date(
      0,
      0,
      projTask.day,
      projTask.start_time + projTask.length
    )
    if (
      (taskStart > projTaskStart && taskStart < projTaskFinish) ||
      (taskFinish > projTaskStart && taskFinish < projTaskFinish)
    ) {
      return false
    }
  }
  return true
}

module.exports = { createTask, updateTask, removeTask }
