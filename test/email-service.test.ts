import { describe, it } from '@jest/globals';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { Transport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import path from 'path';
import EmailService, { IMail } from '../src/services/EmailService';
import EnvironmentLoader from '../src/utils/EnvironmentLoader';
import Logger, { ILogger } from '../src/utils/Logger';
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

describe('Email Service class', () => {
    let emailMsg: EmailService;
    let logger: ILogger;
    let mockMail: Mail;
    let transport: Transport<any>;

    beforeEach(() => {
        transport = {
            name: 'MockMailService',
            version: '1.0',
            send: (mailOptions: any, callback: (err: any, info: any) => void) => {
                const messageInfo = {
                    envelope: {},
                    messageId: 'MessageId',
                    accepted: {},
                    rejected: {},
                    pending: {},
                    response: 'test response',
                };

                callback(null, messageInfo);
            },
        };

        mockMail = new Mail(transport);
        logger = new Logger(testEnvVariables);
        emailMsg = new EmailService(logger, testEnvVariables, mockMail);
    });

    it('should create an instance using its constructor', () => {
        expect(mockMail).to.exist;
        expect(logger).to.exist;
        expect(emailMsg).to.exist;
        expect(transport).to.exist;
    });

    it('should fail on send the email', async () => {
        let data = {
            email: {
                header: {},
                body: {},
            },
        } as IMail;

        emailMsg.send(data, (isEmailSent: boolean) => {
            expect(isEmailSent).false;
        });

        data = {
            email: {
                header: {
                    from: 'test@example.com',
                    to: 'test3@example.com',
                    subject: 'Im a test message',
                },
                body: {},
            },
        } as IMail;

        emailMsg.send(data, (isEmailSent: boolean) => {
            expect(isEmailSent).false;
        });

        transport = {
            name: 'MockMailService',
            version: '1.0',
            send: (mailOptions: any, callback: (err: any, info: any) => void) => {
                const messageInfo = {
                    envelope: {},
                    messageId: 'MessageId',
                    accepted: {},
                    rejected: {},
                    pending: {},
                    response: 'test response',
                };

                callback(new Error('An error has ocurred sending  the email'), messageInfo);
            },
        };

        data = {
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
        } as IMail;

        mockMail = new Mail(transport);
        emailMsg = new EmailService(logger, testEnvVariables, mockMail);
        emailMsg.send(data, (isEmailSent: boolean) => {
            expect(isEmailSent).false;
        });
    });

    it('should send the email', async () => {
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

        emailMsg.send(data, (isEmailSent: boolean) => {
            expect(logger.info.call.length).equal(1);
            expect(isEmailSent).to.be.true;
        });
    });
});
