const express = require("express")
const router = express.Router()
const Joi = require('@hapi/joi')
      .extend(require('@hapi/joi-date'))
Joi.objectId = require('joi-objectid')(Joi)
const auth = require('../middleware/auth')
const projectController = require("../controllers/projectController")
const taskController = require("../controllers/taskController")
const refreshAuth = require("../middleware/refreshAuth")


// Projects list route
router.get("/", auth, projectController.allProjects, refreshAuth) // works but if empty, returns empty array

// Project view route
router.get("/:projectId", auth, projectController.getProject, refreshAuth) // works if projectId is correct and project exist but hangs
// if projectId sent is invalid or doesnt exist in DB

// create Project route
router.post("/", auth, projectController.create, refreshAuth ) // works

// update Project route
router.put("/:projectId", auth, projectController.update, refreshAuth) // works properly if body is correct and Id is correct. Wont work otherwise
// we're not catching errors when body is incorrect

// delete Project route
router.delete("/:projectId", auth, projectController.remove, refreshAuth ) // works properly if projectId is valid. If a project is deleted, it is not being removed from User.projects.

// get project users
router.get("/:projectId/users", auth, projectController.usersInProject, refreshAuth) // works if projectId is correct

// get app users not in project
router.get("/:projectId/add_users", auth, projectController.usersNotInProject, refreshAuth) // works correctly

// Project add any user role to a project
router.post("/:projectId/users", auth, projectController.addUser, refreshAuth ) // works with appropriate with appropriate body
// { "role": ("Read" or "Write"), "user": { "userId" }
// we dont check to see if a user is already in the project

// Remove User from Project
router.delete("/:projectId/users/:userId", auth, projectController.removeUser, refreshAuth ) // works correctly - dont send body, send if of
// user you want to delete in request url. If you try to delete a user that's not in the project the request hangs with

// Update user within a project aka adding them
router.put("/:projectId/users/:userId", auth, projectController.updateUser, refreshAuth ) // works correctly

// Add Task to Project Path
router.put("/:projectId/tasks", auth, taskController.createTask, refreshAuth ) // we're not figuring out dates correctly

// Get Single Task based on Id
router.get("/:projectId/tasks/:taskId", auth, taskController.getTask, refreshAuth) // building now

// Update all tasks in Projects -> used in Grid.js
router.put("/:projectId/tasks/edit", auth, taskController.updateAllTasks, refreshAuth ) // works

// Edit Task Route
router.put("/:projectId/tasks/:taskId", auth, taskController.updateTask, refreshAuth ) // works

// Delete Task Route
router.delete("/:projectId/tasks/:taskId", auth, taskController.removeTask, refreshAuth ) // works


module.exports = router