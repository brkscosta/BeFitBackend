import { expect } from 'chai';
import { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { CEmailService } from './../src/services/CEmailService';

describe('Email Service', async () => {
    const email = {
        header: {
            from: 'joanacosta.costa007@gmail.com',
            to: 'joanacosta97@hotmail.com',
            subject: 'Teste Subject',
        },
    };

    const mockedEmailTransporter: Transporter = {
        sendMail: async (mailOptions: Mail.Options) => {
            expect(mailOptions.from).to.equal(email.header.from);
            expect(mailOptions.to).to.equal(email.header.to);
            expect(mailOptions.subject).to.equal(email.header.subject);

            return { response: 'Teste blablbalb OK' };
        },
        on: (event, listener: (err: Error) => void) => {
            expect(event).to.equal('error');
            expect(listener).to.be.a.instanceof(Function);
            return;
        },
    } as Transporter;
    const emailMsg = new CEmailService(mockedEmailTransporter);

    it('should create an instance using its constructor', async () => {
        expect(emailMsg, 'should exist').to.exist;
    });

    it('should send the email', async () => {
        const isEmailSent = await emailMsg.sendMail(email.header, { body: 'Im a body test message' });
        expect(isEmailSent).be.true;
    });
});
