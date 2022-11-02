import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';
import { app } from '../app';
import { Model } from 'sequelize';
import { allMatchesReturn, createMatchInput, createMatchReturn, matchesInProgressReturn, matchesNotInProgressReturn } from './mocks/match.mock';
import { user } from './mocks/user.mocks';
import User from '../database/models/UserModel'


chai.use(chaiHttp)

const { expect } = chai

describe('GET /matches', () => {
  describe('se estiver com a query inProgress como true', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findAll').resolves(matchesInProgressReturn as any)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/matches?inProgress=true')

        expect(httpResponse.status).to.equal(200)
        expect(httpResponse.body).to.deep.equal(matchesInProgressReturn)
    })
  })
  describe('se estiver com a query inProgress como false', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findAll').resolves(matchesNotInProgressReturn as any)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/matches?inProgress=false')

        expect(httpResponse.status).to.equal(200)
        expect(httpResponse.body).to.deep.equal(matchesNotInProgressReturn)
    })
  })
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findAll').resolves(allMatchesReturn as any)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/matches')

        expect(httpResponse.status).to.equal(200)
        expect(httpResponse.body).to.deep.equal(allMatchesReturn)
    })
  })
})

describe('POST /matches', () => {
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves(user as User)
      sinon.stub(Model, 'create').resolves(createMatchReturn as any)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 201', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/matches')
        .send(createMatchInput)
        .set('Authorization', 'token')

      expect(httpResponse.status).to.equal(201)
      expect(httpResponse.body).to.deep.equal(createMatchReturn)
    })
  })
})