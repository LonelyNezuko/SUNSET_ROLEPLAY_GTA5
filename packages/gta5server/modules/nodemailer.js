const logger = require('./logger')
try
{
    const nodemailer = {}
    const sendNodemailer = require('nodemailer')

    nodemailer.transport = null
    nodemailer.connect = () =>
    {
        try
        {
            nodemailer.transport = sendNodemailer.createTransport({
                service: 'gmail',
                auth:
                {
                    user: 'sunsetgta5@gmail.com',
                    pass: '551202500pk',
                }
            })
            logger.log('Nodemailer create transport: OK!')
        }
        catch(e)
        {
            logger.error('Nodemailer create transport: ERROR!', e)
        }
    }

    nodemailer.send = (email, title, text, html = null) =>
    {
        try
        {
            if(!html) nodemailer.transport.sendMail({
                    from: 'SUNSET ROLE PLAY | GTA 5',
                    to: email,
                    subject: title,
                    text: text
                })
            else nodemailer.transport.sendMail({
                    from: 'SUNSET ROLE PLAY | GTA 5',
                    to: email,
                    subject: title,
                    html: html
                })

            logger.log('Nodemailer send', {
                email: email,
                title: title,
                text: text,
                html: html
            })
        }
        catch(e)
        {
            logger.error('nodemailer send email', e)
        }
    }

    module.exports = nodemailer
}
catch(e)
{
    logger.error('nodemailer.js', e)
}
