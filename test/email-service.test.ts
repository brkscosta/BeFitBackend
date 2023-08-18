import { describe, it } from '@jest/globals';
import { expect } from 'chai';
import { Transport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import EmailService, { IMail } from '../src/services/EmailService';
import Logger, { ILogger } from '../src/utils/Logger';

const testEnvVariables = {
    NODE_ENV: 'DEV',
    PORT: 9999,
    MONGO_DB_CONN_URL: 'MONGO_DB_CONN_URL',
    GMAIL_EMAIL: 'GMAIL_EMAIL',
    MONGO_DB_NAME: 'MONGO_DB_NAME',
    GMAIL_PASSWORD: 'GMAIL_PASSWORD',
    ACCESS_TOKEN_SECRET: 'ACCESS_TOKEN_SECRET',
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
            send: (_mailOptions: any, callback: (err: any, info: any) => void) => {
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
