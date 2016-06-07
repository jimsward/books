var nodemailer = require('nodemailer');

function SendEmail() {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof SendEmail)) {
        console.log('Warning: SendEmail constructor called without "new" operator');
        return new SendEmail();
    }
	this.send = function(req, res) {
		console.log('request : ' + req.body)
    var transporter = nodemailer.createTransport("SMTP",{
        service: 'Yahoo',
        auth: {
            user: 'guernevilleguys@yahoo.com', //  email id
            pass: 'Ec2A_xx' //  password
        }
    });
	var text = req.body.text
	var mailOptions = {
    from: 'guernevilleguys@yahoo.com>', 
	to: req.body.email,
    subject: 'New contact form',
    text: text // plaintext body
    };
	
	transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        res.json({yo: 'error'});
    }else{
        console.log('Message sent: ' + info.message);
        res.json({yo: info.response});
    }
})

	
	}
}
module.exports = SendEmail;
