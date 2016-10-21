process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var EntriesDAO = require('../entries').EntriesDAO
var server = require('../app');

var expect = require('chai').expect
chai.use(chaiHttp);

    describe('Entries', function () {
          it('should list ALL entries on /entries GET', function(done) {
            chai.request(server)
                .get('/entries')

                .end(function (err, res) {
                    console.log(res.status)
                    expect(res.status).to.equal(200)
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('items');
                    expect(res.body.items).to.have.length(40)
                    done();
                });
        });
    });
describe('newentry', function () {
    it('should add an entry to the entries collection', function(done) {
        var date = new Date()
        var dtArr =  date.getMonth() + 1 +'/' + date.getDate() + '/' + date.getFullYear()
        var entry = {date : dtArr, reference : 'payment', payment : 0, deposit :0, account : 'advertising'  }
        chai.request(server)
            .post('/newentry')
            .send(entry)

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res).to.be.json;
                expect(res.body.items[39]).to.have.property('date');
                expect(res.body.items[39].date).to.match(/\d{4}\/\d{2}\/\d{2}/)
                done();
            });
    });
});
describe('search register', function () {
    it('should find entries in the entries collection', function(done) {
        var obj = {key : 'date', val : '2015-02-26'}
        chai.request(server)
            .get('/find')
            .query(obj)

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(3)
                done();
            });
    });
});
describe('list accounts', function () {
    it('should respond with an array of all the account names', function(done) {
        chai.request(server)
            .get('/accounts')

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res).to.be.json;
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(120)
                done();
            });
    });
});
describe('check update', function () {
    it('should find update a document in the entries collection', function(done) {
        var obj = {
            "_id": "55219690bb662780ede4763d",
            "date": "2000/01/03",
            "reference": "Transfer",
            "number": "",
            "payee": "",
            "memo": "Funds Transfer",
            "account": "Petty Cash",
            "payment": "4000",
            "deposit": "0"
        }
        chai.request(server)
            .post('/chkUpdate')
            .send(obj)

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('object');
                done();
            });
    });
});
describe('display customers', function () {
    this.timeout(15000);
    it('should return an array of customer documents', function(done) {

        chai.request(server)
            .get('/customers')

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
describe('get customer', function () {
    this.timeout(15000);
    it('should return a customer documents', function(done) {

        chai.request(server)
            .get('/customer')
            .query({name : 'test'})

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('object');
                done();
            });
    });
});
describe('new customer', function () {
    it('should add a customer to the customers collection', function(done) {

        chai.request(server)
            .post('/newCustomer')
            .send({name : 'test'})

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                done();
            });
    });
});
describe('update customer', function () {
    it('should update a customer document', function(done) {
        var obj = {
            "_id":  "55a6a281428a7460d9ed4280"
            ,
            "name": "test",
            "company": "",
            "address": "test address, city, CA 95446",
            "phone": "123-4567",
            "email": "",
            "balance": "99",
            "entries": [],
            "invoices": []
        }

        chai.request(server)
            .post('/customerUpdate')
            .send(obj)

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                done();
            });
    });
});

describe('get invoice', function () {
    it('should respond with an invoice document', function(done) {
        var obj = {number : 43}

        chai.request(server)
            .get('/invoice')
            .query(obj)

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                done();
            });
    });
});
describe('new invoice', function () {

    beforeEach(function(done){
        chai.request(server)
            .post('/deleteInvoice')
            .send({number : '9999'})

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                done();
            });
    });



    it('should add an invoice to the customers collection', function(done) {
        var obj =
        {
            "date" : "2001/01/05",
            "type" : "Invoice",
            "number" : 9999,
            "name" : "Al Ruoff",
            "lines" : [
                {
                    "activity" : "Accounts Receivable",
                    "memo" : "",
                    "amount" : 240
                },
                {
                    "activity" : "Services",
                    "memo" : "Trim/remove branches (Prune 3 trees)",
                    "amount" : 240
                }
            ],
            "total" : 240,
            "address" : "921 Cottonwood Ct, Petaluma, CA 94052"
        }
        chai.request(server)
            .post('/newInvoice')
            .send(obj)

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                done();
            });
    });
});
describe('list services', function () {
    it('should return an array of services documents', function(done) {

        chai.request(server)
            .get('/services')

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
describe('list transactions', function () {
    it('should return an array of transactionss documents', function(done) {

        chai.request(server)
            .get('/transactions')

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
describe('list accounts', function () {
    it('should return an array of services documents', function(done) {

        chai.request(server)
            .get('/accounts')

            .end(function (err, res) {
                expect(res.status).to.equal(200)
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
