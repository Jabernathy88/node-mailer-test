require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

const app = express()

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('contact')
})

app.post('/send', (req, res) => {
  const recipient = req.body.toField 
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'jeremy.helium.test@gmail.com', // generated ethereal user
        pass: process.env.MAIL_PASS // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'NODE MAILER', // sender address
    to: 'josh@heliumservices.com', // list of receivers
    subject: 'Chatbot Test Email', // Subject line
    text: 'Sent from nodemailer plain text!', // plain text body
    html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg: 'Email has been sent!'})
  });
})

app.listen(3000, () => console.log('Server listening on Port 3000.'))