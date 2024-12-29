
import nodemailer from 'nodemailer';

let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mdfaizanrasheed123@gmail.com',
        pass: 'wlhw ofip lxhs zzeg',
    },
});

let mailOptions = {
    from: 'mdfaizanrasheed123@gmail.com',
    to: 's1391792@gmail.com',
    subject: 'Testing Nodemailer',
    html:`<h1>Welcome to GptCoder</h1> <p>Please learn and earn using gpt</p>`,
    attachments:[
        {
            filename:'image.png',
            path:'./image/first.png'
        },
        {
            filename:'WordFile.docx',
            path:'./image/pdfile.docx'
        }
    ]
};

transport.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log('Error Occurred:', error);
    } else {
        console.log('Email sent to ' + mailOptions.to, info.response);
    }
});
