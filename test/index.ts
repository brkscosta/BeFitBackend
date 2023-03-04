import { expect } from 'chai';
import CEnvironmentLoader from '../src/utils/CEnvironmentLoader';
import CEmailService from './../src/services/CEmailService';
import CLogger from './../src/utils/CLogger';

describe('Email Service', async () => {
    // const header = {
    //     from: 'joanacosta.costa007@gmail.com',
    //     to: 'joanacosta97@gmail.com',
    //     subject: 'Teste',
    // };
    // const body = { body: 'Teste' };
    // const email = { header: header, body: body };

    const enverionmentLoader = new CEnvironmentLoader().get();
    const logger = new CLogger(enverionmentLoader);
    const emailMsg: CEmailService = new CEmailService(logger, enverionmentLoader);

    it('should create an instance using its constructor', () => {
        expect(emailMsg, 'should exist').to.exist; // tslint:disable-line:no-unused-expression
    });
});
