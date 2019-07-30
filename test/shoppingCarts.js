var assert = require('assert')
const uuid = require('uuid')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../app')
const should = chai.should()
chai.use(chaiHttp)

const username = uuid()
let token
let productId

describe('Shopping cart', () => {
  describe('login', () => {
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
          token = 'Bearer ' + res.body.token
          done()
        })
    })
  })
  describe('get cart', () => {
    it('should return 200', done => {
      chai.request(server)
        .get('/shoppingCarts')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .send({ username, password: 'mocha' })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
  describe('list products', () => {
    it('should list all products', done => {
      chai.request(server)
        .get('/products')
        .send({})
        .end((err, res) => {
          res.should.have.status(200)
          productId = res.body[0].id
          done()
        })
    })
  })
  describe('add cart', () => {
    it('should return 200', done => {
      chai.request(server)
        .post('/shoppingCarts/add')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .send({ productId })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
  describe('remove cart', () => {
    it('should return 200', done => {
      chai.request(server)
        .post('/shoppingCarts/remove')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .send({ productId })
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
  describe('clear cart', () => {
    it('should return 200', done => {
      chai.request(server)
        .post('/shoppingCarts/clear')
        .set('Authorization', token)
        .set('Content-Type', 'application/json')
        .end((err, res) => {
          res.should.have.status(200)
          done()
        })
    })
  })
})
