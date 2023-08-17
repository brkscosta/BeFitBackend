import { describe, it } from '@jest/globals';
import { expect } from 'chai';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import * as sinon from 'sinon';
import EmailService, { IMail } from '../src/services/EmailService';
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
    let emailMsg: EmailService;
    let sendMailStub: sinon.SinonStub<any, any>;

    beforeEach(() => {
        const logger = new Logger(testEnvVariables);
        emailMsg = new EmailService(logger, testEnvVariables);
        sendMailStub = sinon.stub(nodemailer, 'createTransport');
    });

    afterEach(() => {
        sendMailStub.restore();
    });

    it('should create an instance using its constructor', () => {
        expect(emailMsg).to.exist;
    });

    it('should fail on send the email', async () => {
        const data: IMail = {
            email: {
                header: {
                    from: '',
                    to: '',
                    subject: '',
                },
                body: {
                    message: '',
                },
            },
        };
        const sendMailMock = sinon.stub().yields(data);
        sendMailStub.returns({ sendMail: sendMailMock });

        await emailMsg.send(data, (isEmailSent: boolean) => {
            expect(isEmailSent).to.be.false;
        });
    });

    it('should fail on send the email', async () => {
        const data: IMail = {
            email: {
                header: {
                    from: 'test@example.com',
                    to: 'test3@example.com',
                    subject: 'Im a test message',
                },
                body: {
                    message: 'Message',
                },
            },
        };
        const sendMailMock = sinon.stub().yields(data);
        sendMailStub.returns({ sendMail: sendMailMock });

        await emailMsg.send(data, (isEmailSent: boolean) => {
            expect(isEmailSent).to.be.true;
        });
    });
});
