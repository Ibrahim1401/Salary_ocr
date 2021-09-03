/* eslint-disable max-len */
const chai= require('chai');
const chaihttp = require('chai-http');
const server = require('../index');
const config = require('../config/properties.json');

// assertion type is 'should' using chai library

chai.should();
chai.use(chaihttp);
const expect = chai.expect;

describe('Testing Master API', ()=> {
  // eslint-disable-next-line max-len
  // Testing GET request, that is it able to get details of model names that is matching

  it('It should output the response, on inputting the valid input params', (done)=> {
    chai.request(server)
        .post(`/multiBureau`)
        .send( 
          {
           "SymmetricKeyEncryptedValue": "pjWMo97sUh230o6epf0JxHbdzFDAnbE50BkckO4/NmatNo4uF8DFCJxqSxIwi+NbAZY9YI8m9zdaxXYLzo4wId0HOTy77Avb4UTTAjCa2oQPfxhT8EjjTDh4Gz6uHICc3Xa+gxRZPBMUVPUGvGc7+7OPat9d8irmRsIQeyYaAV3cHIjl922s9OA61FoN9OONeJ2UB0TPdB8EyBPByJGuW8hM7/eci34FNWrzERDEyDlhPQH156F5CJMyXoIrlVf5VJKChzMYElrZ/wOhaTNKxtyGkdkjzfS0on6jWQVNFIyBQoJyZiG/8V0jYWTR+xTHtB9uxd3im0AnFXMB/nHRrQ==",
           "RequestEncryptedValue": "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"
          }
          )
        .end((err, res)=> {
            res.should.have.status(200);
            expect(res.body).to.have.property('mRefNo');
            expect(res.body).to.have.property('scoreDesc');
            expect(res.body).to.have.property('score');
            expect(res.body).to.have.property('scoreBand');
            expect(res.body).to.have.property('success');
            expect(res.body).to.have.property('runDesc');
            expect(res.body).to.have.property('status');

            done();
        });
  });

  it('It should output the response, on inputting the invalid input params', (done)=> {
    chai.request(server)
        .post(`/multiBureau`)
        .send(
          {
            "SymmetricKeyEncryptedValue": "preeerrreeeeeeeeeeeejWMo97sUh230o6epf0JxHbdzFDAnbE50BkckO4/NmatNo4uF8DFCJxqSxIwi+NbAZY9YI8m9zdaxXYLzo4wId0HOTy77Avb4UTTAjCa2oQPfxhT8EjjTDh4Gz6uHICc3Xa+gxRZPBMUVPUGvGc7+7OPat9d8irmRsIQeyYaAV3cHIjl922s9OA61FoN9OONeJ2UB0TPdB8EyBPByJGuW8hM7/eci34FNWrzERDEyDlhPQH156F5CJMyXoIrlVf5VJKChzMYElrZ/wOhaTNKxtyGkdkjzfS0on6jWQVNFIyBQoJyZiG/8V0jYWTR+xTHtB9uxd3im0AnFXMB/nHRrQ==",
            "RequestEncryptedValue": "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"
           }
          )
        .end((err, res) => {
            res.should.have.status(413);
            expect(res.text).to.equal('TH99413:Message Size Exceeded Limit');
        
            done();
        });
  });

  it('It should output the response, on inputting the invalid input params', (done)=> {
    chai.request(server)
        .post(`/multiBureau`)
        .send({
          "SymmetricKeyEncryptedValue": "",
          "RequestEncryptedValue": "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"
         }
          
)
        .end((err, res) => {
            res.should.have.status(409);
            expect(res.text).to.equal('TH99400:Decryption Failed');
        
            done();
        });
  });
  });
