import { expect } from 'chai';
import EmailService from './../src/app/services/EmailService';

describe('Email Service', async () => {
    const header = {
        from: 'joanacosta97@gmail.com',
        to: 'joanacosta97@gmail.com',
        subject: 'Teste',
    };
    const body = { body: 'Teste' };
    const email = { header: header, body: body };
    const emailMsg: EmailService = new EmailService(email);

    it('should create an instance using its constructor', () => {
        expect(emailMsg, 'example should exist').to.exist; // tslint:disable-line:no-unused-expression
    });

    it('should return false when the email is sent', async () => {
        const returnValue = await emailMsg.sendMail();
        expect(returnValue.valueOf).to.be.false('Because the credentials are wrong');
    });
});
