import * as fs from 'fs';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index';
import * as path from 'path';
import { IEnverionmentVariables } from '../utils/EnvironmentLoader';
import { ILogger } from '../utils/Logger';

const filePath = path.join(__dirname, './../public/AccountConfirmation.html');
const html = fs.readFileSync(filePath, 'utf-8');

interface IMailAttachment {
    filename: string;
    path: string;
    contentType: string;
}

interface IMailHeader {
    from: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
}

interface IMailBody {
    message: string;
    attachments?: IMailAttachment[];
}

export interface IMail {
    email: { header: IMailHeader; body: IMailBody };
}

export interface IEmailService {
    send(email: IMail, callback: (isEmailSent: boolean) => void): void;
}

export default class EmailService implements IEmailService {
    private readonly logger: ILogger;
    private readonly environmentLoader: IEnverionmentVariables;
    private readonly transporter: nodemailer.Transporter;

    constructor(logger: ILogger, environmentLoader: IEnverionmentVariables) {
        this.logger = logger;
        this.environmentLoader = environmentLoader;

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: this.environmentLoader.GMAIL_EMAIL,
                pass: this.environmentLoader.GMAIL_PASSWORD,
            },
        });
    }

    public async send(emailData: IMail, callback: (isEmailSent: boolean) => void) {
        const { email } = emailData;

        const mailOptions = {
            from: email.header.from,
            to: email.header.to,
            cc: email.header.cc,
            bcc: email.header.bcc,
            subject: email.header.subject,
            html: html.replace('{{activationLink}}', `${email.body.message}`),
            attachments: email.body.attachments,
        };

        this.transporter.sendMail(mailOptions, (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
            if (err) {
                this.logger.error(err.message);
                callback(false);
                return;
            }

            this.logger.info(info.response);
            callback(true);
        });
    }
}
