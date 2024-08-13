 //MADE BY ANANDITA------------------------------------------> 
 //Sending of  mail templates API---------------------------->

const nodemailer = require('nodemailer');
const { mail_template } = require("../mail templates/request");
const { response_template } = require("../mail templates/response");
const { remainder_template } = require("../mail templates/remainder");

module.exports.sendMailToUser = (data, mail_type) => {
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
    } else if (mail_type === "remainder") {
        template = remainder_template({

        });
    }

    const mailOptions = {
        from: `${process.env.BOT_EMAIL_ID}`,
        to: `${process.env.ENV === "prod" ? data.approver_email_id : process.env.RECEIVER_EMAIL_FOR_TEST }`,
        subject: `${data.request_type}`,
        html: template
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