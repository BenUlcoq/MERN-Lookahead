const express = require("express")
const router = express.Router()
const Joi = require('@hapi/joi')
      .extend(require('@hapi/joi-date'))
Joi.objectId = require('joi-objectid')(Joi)
const auth = require('../middleware/auth')
const projectController = require("../controllers/projectController")
const taskController = require("../controllers/taskController")

// Projects list route
router.get("/", auth, projectController.allProjects)

// Project view route
router.get("/:projectId", auth, projectController.getProject)

// create Project route
router.post("/", auth, projectController.create )

// update Project route
router.put("/:projectId", auth, projectController.update)

// delete Project route
router.delete("/:projectId", auth, projectController.remove )

// Project add any user role to a project
router.post("/:projectId/users", auth, projectController.addUser )

// Remove User from Project
router.delete("/:projectId/users/:userId", auth, projectController.removeUser )

router.put("/:projectId/users", auth, projectController.updateUser )

router.put("/:projectId/tasks", auth, taskController.createTask )

router.put("/:projectId/tasks/:taskId", auth, taskController.updateTask )

router.delete("/:projectId/tasks", auth, taskController.removeTask )

module.exports = router