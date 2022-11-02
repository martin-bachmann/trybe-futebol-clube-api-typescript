import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import { Model } from 'sequelize';
import { allMatchesReturn, matchesInProgressReturn } from './mocks/match.mock';

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
