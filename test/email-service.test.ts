import { describe, it } from '@jest/globals';
import { expect } from 'chai';
import dotenv from 'dotenv';
import path from 'path';
import EmailService from '../src/services/EmailService';
import EnvironmentLoader from '../src/utils/EnvironmentLoader';
import Logger from '../src/utils/Logger';
dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

const environmentLoader = new EnvironmentLoader().get();

const testEnvVariables = {
    NODE_ENV: environmentLoader.NODE_ENV,
    PORT: environmentLoader.PORT,
    MONGO_DB_CONN_URL: environmentLoader.MONGO_DB_CONN_URL,
    GMAIL_EMAIL: environmentLoader.GMAIL_EMAIL,
    MONGO_DB_NAME: environmentLoader.MONGO_DB_NAME,
    GMAIL_PASSWORD: environmentLoader.GMAIL_PASSWORD,
    ACCESS_TOKEN_SECRET: environmentLoader.ACCESS_TOKEN_SECRET,
};

describe('Email Service', () => {
    const logger = new Logger(testEnvVariables);
    const emailMsg = new EmailService(logger, testEnvVariables);

    it('should create an instance using its constructor', () => {
        expect(emailMsg, 'should exist').to.exist;
        expect(logger, 'should exist').to.exist;
    });

    it('should fail on send the email', async () => {
        const data = {
            email: {
                header: {
                    from: 'joanacosta.costa007@gmail.com',
                    to: '',
                    subject: 'Teste Subject',
                },
                body: {
                    message: 'Aaai que porra caralho aiaaai',
                },
            },
        };

        await emailMsg.send(data, (isEmailSent) => {
            expect(isEmailSent).be.false;
        });
    });

    it('should send the email sucessfully', async () => {
        const data = {
            email: {
                header: {
                    from: 'joanacosta.costa007@gmail.com',
                    to: 'joanacosta97@hotmail.com',
                    subject: 'Teste Subject',
                },
                body: {
                    message: 'Outra mensagem',
                },
            },
        };

        await emailMsg.send(data, (isEmailSent) => {
            expect(isEmailSent).be.true;
        });
    });
});
