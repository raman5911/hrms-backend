 //MADE BY ANANDITA------------------------------------------> 
 //Sending of  mail templates API---------------------------->
 const router = require("express").Router();
const nodemailer = require('nodemailer');
const { mail_template } = require("../mail templates/leave");

module.exports.sendMailToUser = (req, res, reciever_email) => {
    const transporter = nodemailer.createTransport({
        service: 'Outlook365',
        host: 'smtp.office365.com', 
        secure: true ,
 
        auth: {
            user: '',
            pass: ''
        }
    });

    console.log(mail_template);

    const mailOptions = {
        from: '',
        to: 'mehoquotassa-2797@yopmail.com',
        subject: 'Subject of  email',
        html: mail_template()
    };


    // Send email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Invalid login!");
        } else {
            console.log('Email sent:' + info.response);
        }
    });
}