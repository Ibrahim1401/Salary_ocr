const fs = require('fs');
const Joi = require('joi');
const request = require('request');
const logger = require('../logger');
const CryptoJS = require("crypto-js");
const Str = require('@supercharge/strings');
const crypto = require('crypto');
const config = JSON.parse(fs.readFileSync('config/config.json'));
const public = fs.readFileSync("certificate.pem");
const private = fs.readFileSync("key.pem");
const publicKey = public.toString();
const privateKey = private.toString();
const ack_no = Math.round(Date.now() / 1000);

const modelAccess = (req, res) => {

    logger.log('debug', `API Triggered is /multiBureau`);
    const body = req.body
    logger.log('debug', `The request body is ${JSON.stringify({body})}`);
    const keys = Object.keys(config);
    console.log(config)
    console.log(keys)
    let inputStr = body
    function encrypt(text) {
        const key = crypto.randomBytes(32)
        const vector = crypto.randomBytes(16)
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key),vector);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        data_1 = JSON.stringify({vector:vector.toString('hex'),key:key.toString('hex')})
        const encryptedData = crypto.publicEncrypt(
            {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
            },
            Buffer.from(data_1)
        );
        return {GWSymmetricKeyEncryptedValue:encryptedData.toString("base64"),ResponseEncryptedValue:encrypted.toString("base64")} 
        }

    function decrypt(encryptedData){
        try{
        const decryptedData = crypto.privateDecrypt(
            {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
            },
            encryptedData
        );
        //console.log(decryptedData)
        return decryptedData
        }
        catch(err){
            if (err.reason == "data greater than mod len"){
                res.status(413).send({"Status":"TH99413:Message Size Exceeded Limit"});}
            else{
                res.status(400).send({"Status":"TH99400:Decryption Failed"}) 
            }      
        }
    }

    function decrypt1(text,encryptedText) {
        try{
        let vector = Buffer.from(text.vector, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(text.key,'hex'), vector);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        console.log(decrypted.toString())
        return decrypted.toString();}
        catch(err){
            return res.status(400).send({"Status":"TH99400:Decryption Failed"});
        }
    }
    const schema = Joi.object().keys({
        salarySlip:Joi.string().allow(null, ''),
        idProof:Joi.string().allow(null, ''),
        addressProof:Joi.string().allow(null, ''),
        panCard:Joi.string().allow(null, ''),
        applicationNo: Joi.string().required(),
        applicantFirstName: Joi.string().required(),
        applicantLastName: Joi.string().required(),
        employerName: Joi.string().required(),
        companyCategory: Joi.string().required(),
        sourceSystem: Joi.string().required(),
        netSalary: Joi.number().required()
    });
    function sending_data(data) {

    }
    aes_key = decrypt(Buffer.from(inputStr.SymmetricKeyEncryptedValue,"base64")).toString() 
    decrypted_data = JSON.parse(decrypt1(JSON.parse(aes_key),Buffer.from(inputStr.RequestEncryptedValue,"base64")))
    const modelName = decrypted_data.modelName;
    const result =  schema.validate(decrypted_data);
    meta_data = {Ack_no:ack_no,application_no:decrypted_data.applicationNo,callback_url:decrypted_data.sourceSystem}
    fs.writeFile('config/meta_data.json',JSON.stringify(meta_data),function(err){
        if(err) throw err;
      })
    console.log(result)
    if(!result.error)
    {
            logger.log('debug', "API Input validation is success");
            let url = "http://172.0.2.35:81/api/v1/service/kgcmodeltry1/score"

            if(url)
            {
                console.log("url")
                logger.log('debug', `THE URL is ${JSON.stringify(url)}`);
                res.status(200).send(encrypt(JSON.stringify({status:200,Ack_no:meta_data.Ack_No,Application_NO:meta_data.application_no})))
                request({
                    url: url,
                    method: "POST",
                    body: decrypted_data,
                    json: true,
                    headers: { "content-type": "application/json" }
                    }, 
                    (err, body) => {
                    if (err) 
                    {
                        logger.log('error', `Some Internal Error Occurred..! ${err}`); 
                        return res.status(500).send({"Status":`TH99500:Some Internal Error Occurred..! ${err}`}); 
                    }
                    else if(body.body.mRefNo)
                    {
                        console.log(JSON.stringify(body.body))
                        logger.log('info', `Response fetched successfully..!`); 
                        logger.log("info","res")
                        response_data = encrypt(JSON.stringify(body.body))
                        console.log(response_data)
                    }
                    else
                    {
                        logger.log('debug', `Too Many Requests, Try after some time`);
                        res.status(503).send({"Status":"TH99429:Too Many Requests, Try after some time"});
                    }
                });
            }
            else
            {
                logger.log('debug',`Model Name  entered is not valid`);
                res.status(404).send(`Model Name version  entered is not valid`);
            }
            
    }
    logger.log('info', 'API Request processing ended');
};

module.exports = {modelAccess};