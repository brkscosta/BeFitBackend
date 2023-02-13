import { expect } from 'chai';
import EmailService, { IMail, IMailBody, IMailHeader } from './../src/app/services/EmailService';

describe('Example class', () => {
    const header = <IMailHeader>{
        from: 'joanacosta97@gmail.com',
        to: 'joanacosta97@gmail.com',
        subject: 'Teste',
    };
    const body = <IMailBody>{ body: 'Teste' };
    const email = <IMail>{ header: header, body: body };
    const emailMsg: EmailService = new EmailService(email);

    it('should create an instance using its constructor', () => {
        expect(emailMsg, 'example should exist').to.exist; // tslint:disable-line:no-unused-expression
    });

    it('should return whatever is passed to getMail()', () => {
        const returnValue: IMail = emailMsg.getMail();

        expect(returnValue.header).to.equal(header, 'returns the value passed as a parameter');
        expect(returnValue.body).to.equal(body, 'returns the value passed as a parameter');
    });
});
