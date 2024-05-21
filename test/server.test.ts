
import chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../src/server'; // Adjust the import path if necessary

chai.use(chaiHttp);
const { expect } = chai;

describe('GET /weather', () => {
    it('should return weather data for valid coordinates', (done) => {
        chai.request(app)
            .get('/weather')
            .query({ lat: 35, lon: 139 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('weatherCondition');
                expect(res.body).to.have.property('tempCategory');
                expect(res.body).to.have.property('alerts');
                done();
            });
    });

    it('should return 400 if coordinates are missing', (done) => {
        chai.request(app)
            .get('/weather')
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                done();
            });
    });
});
