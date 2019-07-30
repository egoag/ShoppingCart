var assert = require('assert')
const uuid = require('uuid')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
chai.use(chaiHttp)

const username = uuid()

describe('User', () => {
  describe('register', () => {
    it('should success', done => {
      chai.request(server)
        .post('/users/register')
        .send({ username, password: 'mocha' })
        .end((err, res) => {
          res.should.have.status(201)
          done()
        })
    })
  })
  describe('auth', () => {
    it('should return 200', done => {
      chai.request(server)
        .post('/users/authentication')
        .send({ username, password: 'mocha' })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
