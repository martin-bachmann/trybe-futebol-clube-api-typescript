import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import * as jwt from 'jsonwebtoken';
import { app } from '../app';
import { Model } from 'sequelize';
import { allMatchesReturn, createMatchEqualTeamsErrorInput, createMatchInput, createMatchReturn, matchesInProgressReturn, matchesNotInProgressReturn, updateMatchInput } from './mocks/match.mock';
import { user } from './mocks/user.mocks';
import User from '../database/models/UserModel'
import Team from '../database/models/TeamModel';
import { awayTeamReturn, singleTeamReturn } from './mocks/team.mocks';


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
  describe('quando o token não é valido', () => {
    afterEach(() => sinon.restore())

    it('deve retornar um status 401', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/matches')
        .send(createMatchInput)
        .set('Authorization', 'token')

      expect(httpResponse.status).to.equal(401)
      expect(httpResponse.body).to.deep.equal({ message: 'Token must be a valid token' })
    })
  })
  describe('quando os dois times são iguais', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves(user as User)
      sinon.stub(Model, 'findOne').resolves(user as User)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 422', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/matches')
        .send(createMatchEqualTeamsErrorInput)
        .set('Authorization', 'token')

      expect(httpResponse.status).to.equal(422)
      expect(httpResponse.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' })
    })
  })
  describe('quando o time da casa não existe', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves(user as User)
      sinon.stub(Model, 'findOne').resolves(user as User)
      sinon.stub(Model, 'findByPk').resolves(undefined)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 404', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/matches')
        .send(createMatchInput)
        .set('Authorization', 'token')

      expect(httpResponse.status).to.equal(404)
      expect(httpResponse.body).to.deep.equal({ message: 'There is no team with such id!' })
    })
  })
  describe('quando o time visitante não existe', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves(user as User)
      sinon.stub(Model, 'findOne').resolves(user as User)
      sinon.stub(Model, 'findByPk').onFirstCall().resolves(singleTeamReturn as Team)
        .onSecondCall().resolves(undefined)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 404', async () => {
      const httpResponse = await chai
        .request(app)
        .post('/matches')
        .send(createMatchInput)
        .set('Authorization', 'token')

      expect(httpResponse.status).to.equal(404)
      expect(httpResponse.body).to.deep.equal({ message: 'There is no team with such id!' })
    })
  })
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(jwt, 'verify').resolves(user as User)
      sinon.stub(Model, 'findOne').resolves(user as User)
      sinon.stub(Model, 'findByPk').onFirstCall().resolves(singleTeamReturn as Team)
        .onSecondCall().resolves(awayTeamReturn as Team)
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

describe('PATCH /matches/:id/finish', () => {
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(Model, 'update').resolves()
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .patch('/matches/1/finish')

      expect(httpResponse.status).to.equal(200)
      expect(httpResponse.body).to.deep.equal({ message: 'Finished' })
    })
  })
})

describe('PATCH /matches/:id', () => {
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(Model, 'update').resolves()
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .patch('/matches/1')
        .send(updateMatchInput)

      expect(httpResponse.status).to.equal(200)
    })
  })
})