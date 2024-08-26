const nodemailer = require('nodemailer');
const { mail_template } = require("../mail templates/request");
const { response_template } = require("../mail templates/response");
const { reminder_template } = require("../mail templates/reminder");
const { revoke_template } = require("../mail templates/revoke");

module.exports.sendMailToUser = async (data, mail_type) => {
    console.log(data);

    const transporter = nodemailer.createTransport({
        service: `${process.env.SERVICE}`,
        host: `${process.env.HOST}`, 
        secure: true ,
 
        auth: {
            user: `${process.env.BOT_EMAIL_ID}`,
            pass: `${process.env.BOT_EMAIL_PASSWORD}`
        }
    });

    let template;

    if(mail_type === "request") {
        template = mail_template(data);
    } else if (mail_type === "response") {
        template = response_template(data);
    } else if (mail_type === "revoke") {
        template = revoke_template(data);
    } 
    else if (mail_type === "reminder") {
        template = reminder_template(data);
    }

    const mailOptions = {
        from: `${process.env.BOT_EMAIL_ID}`,
        to: `${process.env.ENV === "PROD" ? data.reciever_email_id : process.env.RECEIVER_EMAIL_FOR_TEST }`,
        subject: `${data.request_type}`,
        html: template
    };


    // Send email
    const mailSentOrNot = await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent:' + info.response);
        }
    });

    console.log(mailSentOrNot);
}