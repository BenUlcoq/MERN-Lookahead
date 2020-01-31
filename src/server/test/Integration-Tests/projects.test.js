process.env.NODE_ENV = 'test'

const app = require('../../index')
const mongoose = require("mongoose")
const { UserModel } = require("../../models/user")
const { ProjectModel } = require("../../models/project")
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiAsPromised = require("chai-as-promised")
const JWT = require('jsonwebtoken')
const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(chaiHttp)

let validUser = {
	"firstName": "Test",
	"lastName": "Tester",
	"position": "biggboi",
	"email": "test@test.com",
	"password": "Test1245"
}

let validUser2 = {
	"firstName": "Test",
	"lastName": "Tester",
	"position": "biggboi",
	"email": "test@test.com",
	"password": "Test1245"
}

let validProject = {
			"title": "Test Project",
      "create_date": "2020-02-01",
      "start_date": "2020-02-02",
      "end_date": "2020-02-05",
      "timezone": 10,
      "owner": undefined
}

let validTask = {
	"title": "Build House",
	"start_time": 2,
	"length": 4,
	"day": 1,
	"description": "Big Yeet"
}

if (mongoose.connection.name === 'lookahead-test') {

  describe('Project Integration Tests', () => {

		before( (done) => {
      mongoose.connect('mongodb://localhost/lookahead-test', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
      .then(
      mongoose.connection
        .once('open', () => {
          // console.log('Connected to the Test Database')
          done()
        })
        .on('error', (error) => {
            console.warn('Error : ',error)
      })
      )
    })

    beforeEach( (done) => {
      mongoose.connection.db.dropDatabase(() => {
        done()
      })
    })

    after( (done) => {
      console.log('Closing Connection')
      mongoose.connection.close(() => {
        done()
      })
		})

		beforeEach( (done) => {

			chai.request(app)
			.post('/api/users')
			.type('form')
			.send(validUser)
			.end((oof, yeet) => {
				
				chai.request(app)
				.post('/api/auth')
				.type('form')
				.send({
					"email": "test@test.com",
					"password": "Test1245"
				})
				.end((err, res) => {
					authToken = res.body.token
					validProject.owner = JWT.decode(res.body.token)._id
					done()
				})
			})
		})

		
		describe('Successful Operations', () => {

			it('Creates a Project Successfully', (done) => {
			
				chai.request(app)
          .post('/api/projects')
					.type('form')
					.set('Authorization', `Bearer ${authToken}`)
          .send(validProject)
          .end((err, res) => {
              expect(res.body.message).to.equal("Project successfully created.")
              done()
					})

				})

			

			describe('Edit Project', () => {

				let projectId

				beforeEach( (done) => {
					chai.request(app)
          .post('/api/projects')
					.type('form')
					.set('Authorization', `Bearer ${authToken}`)
          .send(validProject)
          .end((err, res) => {

						ProjectModel.find({ title: "Test Project"},
							function (err, project) {
								projectId = project._id
							}
						)
						done()
					})
				})


				it('Update Project Details', (done) => {
					chai.request(app)
						.put(`/api/projects/${projectId}`)
						.type('form')
						.set('Authorization', `Bearer ${authToken}`)
						.send(
							{
								"end_date": "2020-02-10",
								"timezone": -4,
								"title": "Real Project"}
						)
						.end((err, res) => {

							ProjectModel.findById((projectId)),
								function (err, project) {
									expect(project.title).to.be("Real Project")
									expect(project.timezone).to.be(-4)
									expect(project.end_date).to.be("2020-02-10")
									expect(res).to.have.status(200)
									done()
								}
							)

						})
				})


				it('Delete Project', (done) => {
					expect(true).to.equal(false)
					done()
				})

				
					
					it('Creates a Task Successfully', (done) => {
					
						chai.request(app)
						.put(`/api/projects/${projectId}`)
						.type('form')
						.set('Authorization', `Bearer ${authToken}`)
						.send(validTask)
						.end((err, res) => {

							ProjectModel.find({ title: "Test Project"},
								function (err, project) {
									expect(project.tasks[0]._id).to.exist
									expect(res).to.have.status(200)
									done()
								}
							)

						})

					})
					
					describe('Task Edits', () => {

						let taskId

						beforeEach(() => {
						chai.request(app)
						.put(`/api/projects/${projectId}/${taskId}`)
						.type('form')
						.set('Authorization', `Bearer ${authToken}`)
						.send(validTask)
						.end((err, res) => {

							ProjectModel.find({ title: "Test Project"},
								function (err, project) {
									taskId = project.tasks[0]._id
								}
							)
						})
					})

				
					it('Delete a Task Successfully', (done) => {
					
						chai.request(app)
						.delete(`/api/projects/${projectId}`)
						.set('Authorization', `Bearer ${authToken}`)
						.send(taskId)
						.end((err, res) => {

							ProjectModel.find({ title: "Test Project"},
								function (err, project) {
									expect(project.tasks[0]).to.not.exist
									expect(res).to.have.status(200)
									done()
								}
							)

						})

					})

					it('Update a Task Successfully', (done) => {

						chai.request(app)
						.put(`/api/projects/${projectId}/${taskId}`)
						.set('Authorization', `Bearer ${authToken}`)
						.send({
							"title": "Build Apartment",
							"start_time": 3,
							"length": 3,
							"day": 3,
							"description": "Bigger Yeetimus"
						})
						.end((err, res) => {

							ProjectModel.find({ title: "Test Project"},
								function (err, project) {
									expect(project.tasks[0]).to.have.property('title', 'Build Apartment')
									expect(project.tasks[0]).to.have.property('start_time', 3)
									expect(project.tasks[0]).to.have.property('length', 3)
									expect(project.tasks[0]).to.have.property('day', 3)
									expect(project.tasks[0]).to.have.property('description', 'Bigger Yeetimus')
									expect(res).to.have.status(200)
									done()
								}
							)

						})

					})
						
				})

				describe('User changes', () => {

					it('Add User to Project', (done) => {
						expect(true).to.equal(false)
						done()
					})

					it('Remove User from Project', (done) => {
						expect(true).to.equal(false)
						done()
					})

					it('Edit Existing User Role', (done) => {
						expect(true).to.equal(false)
						done()
					})

				})

			})

		})

		describe('Unsuccessful Operations', () => {

			it('Unauthorised User should reject', (done) => {
				expect(true).to.equal(false)
				done()
			})

			it('Invalid Project Details should reject', (done) => {
				expect(true).to.equal(false)
				done()
			})

			describe('Project Updates', () => {

				it('Invalid Timezone should reject', (done) => {
					expect(true).to.equal(false)
					done()
				})

				it('Earlier End Date should reject', (done) => {
					expect(true).to.equal(false)
					done()
				})


			})

		})
    

  })

}