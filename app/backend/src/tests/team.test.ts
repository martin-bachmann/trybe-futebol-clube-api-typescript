import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Model } from 'sequelize';
import Team from '../database/models/TeamModel';
import { allTeamsReturn, singleTeamReturn } from './mocks/team.mocks';

chai.use(chaiHttp)

const { expect } = chai

describe('GET /teams', () => {
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findAll').resolves(allTeamsReturn as Team[])
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams')

        expect(httpResponse.status).to.equal(200)
        expect(httpResponse.body).to.deep.equal(allTeamsReturn)
    })
  })
})

describe('GET /teams/:id', () => {
  describe('em caso de sucesso', () => {
    beforeEach(() => {
      sinon.stub(Model, 'findOne').resolves(singleTeamReturn as Team)
    })
    afterEach(() => sinon.restore())

    it('deve retornar um status 200', async () => {
      const httpResponse = await chai
        .request(app)
        .get('/teams/5')

      expect(httpResponse.status).to.equal(200)
      expect(httpResponse.body).to.deep.equal(singleTeamReturn)
    })
  })
})