var assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
chai.use(chaiHttp)

describe('Product', () => {
  describe('List', () => {
    it('should list all products', done => {
      chai.request(server)
        .get('/products')
        .send({})
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
  describe('Add', () => {
    it('should add one product', done => {
      chai.request(server)
        .post('/products')
        .send({ name: 'test', price: 0.01 })
        .end((err, res) => {
          res.should.have.status(201)
          done()
        })
    })
  })
})
