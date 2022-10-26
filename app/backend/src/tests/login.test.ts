import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Model } from 'sequelize';
import User from '../database/models/UserModel'
import UserService from '../service/UserService'

chai.use(chaiHttp)

const { expect } = chai

describe('POST /login', () => {
  describe('quando o campo "email" não é informado', () => {
    it('deve retornar um status 400', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ password: '123456' })
      
      expect(httpResponse.status).to.equal(400)
      expect(httpResponse).to.deep.equal({ 'message': 'All filds must be filled' })
    })
  })
  describe('quando o campo "password" não é informado', () => {
    it('deve retornar um status 400', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com' })
      
      expect(httpResponse.status).to.equal(400)
      expect(httpResponse).to.deep.equal({ 'message': 'All filds must be filled' })
    })
  })  
  describe('quando o email informado não consta no banco de dados', () => {
    before(() => sinon.stub(Model, 'findOne').resolves(null))
    after(() => sinon.restore())

    it('deve retornar um status 401', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com', password: '123456' })
      
      expect(httpResponse.status).to.equal(401)
      expect(httpResponse).to.deep.equal({ 'message': 'Incorrect email or password' })
    })
  }) 
  describe('quando o email é encontrado mas a senha é incorreta', () => {
    const user = { id: 1, username: 'usuario', email: 'usuario@prov.com', password: 'wrong_password'}
    before(() => sinon.stub(Model, 'findOne').resolves(user as User))
    before(() => sinon.stub(UserService.prototype, 'checkPassword').returns(false))
    after(() => sinon.restore())
    
    it('deve retornar um status 401', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com', password: '123456' })
      
      expect(httpResponse.status).to.equal(401)
      expect(httpResponse).to.deep.equal({ 'message': 'Incorrect email or password' });
    })
  })
  describe('quando as credenciais estão corretas', () => {
    const user = { id: 1, username: 'usuario', email: 'usuario@prov.com', password: '123456' }
    before(() => sinon.stub(Model, 'findOne').resolves(user as User))
    before(() => sinon.stub(UserService.prototype, 'checkPassword').returns(true))
    after(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com', password: '123456' })
      
      expect(httpResponse.status).to.equal(400)
      expect(httpResponse.body).to.have.key('token')
      expect(httpResponse.body.token).to.be.a('string')
    })
  })
})
