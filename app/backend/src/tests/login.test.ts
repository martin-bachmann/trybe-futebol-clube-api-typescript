import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { app } from '../app';
import { Model } from 'sequelize';
import User from '../database/models/UserModel'
import { user } from './mocks/user.mocks';

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
      expect(httpResponse.body).to.deep.equal({ 'message': 'All fields must be filled' })
    })
  })
  describe('quando o campo "password" não é informado', () => {
    it('deve retornar um status 400', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com' })
      
      expect(httpResponse.status).to.equal(400)
      expect(httpResponse.body).to.deep.equal({ 'message': 'All fields must be filled' })
    })
  })  
  describe('quando o email informado não consta no banco de dados', () => {
    beforeEach(() => sinon.stub(Model, 'findOne').resolves(null))
    afterEach(() => sinon.restore())

    it('deve retornar um status 401', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'wrong_email@prov.com', password: '123456' })
      
      expect(httpResponse.status).to.equal(401)
      expect(httpResponse.body).to.deep.equal({ 'message': 'Incorrect email or password' })
    })
  }) 
  describe('quando o email é encontrado mas a senha é incorreta', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findOne').resolves(user as User)
      sinon.stub(bcrypt, 'compare').resolves(false)
    })
    afterEach(() => sinon.restore())
    
    it('deve retornar um status 401', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com', password: 'wrong_password' })
      
      expect(httpResponse.status).to.equal(401)
      expect(httpResponse.body).to.deep.equal({ 'message': 'Incorrect email or password' });
    })
  })
  describe('quando as credenciais estão corretas', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findOne').resolves(user as User)
      sinon.stub(bcrypt, 'compare').resolves(true)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/login')
        .send({ email: 'usuario@prov.com', password: '123456' })
      
      expect(httpResponse.status).to.equal(200)
      expect(httpResponse.body).to.have.key('token')
      expect(httpResponse.body.token).to.be.a('string')
    })
  })
})

describe('GET /login/validate', () => {
  describe('quando as credenciais estão corretas', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves(user as User)
      sinon.stub(Model, 'findOne').resolves(user as User)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/login/validate')
        .send()
        .set('Authorization', 'token')
      
      expect(httpResponse.status).to.equal(200)
      expect(httpResponse.body).to.have.key('role')
      expect(httpResponse.body.role).to.equal('admin')
    })
  })
})