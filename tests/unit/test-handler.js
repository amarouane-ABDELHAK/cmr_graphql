'use strict';

const fs = require('fs');
const app = require('../../app.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;

const contents = fs.readFileSync('../event.json');
event = JSON.parse(contents);

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await app.lambdaHandler(event, context)
        console.log("RESULT");
        console.log(result);
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.collection.short_name).to.be.equal("Test Collection 1");
        // expect(response.location).to.be.an("string");
    });
});
