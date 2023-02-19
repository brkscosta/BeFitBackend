import * as fs from 'fs';
import nodemailer, { Transporter } from 'nodemailer';
import * as path from 'path';
import sanitizedConfig from '../config';
import ErrorHandler from '../utils/ErrorHandler';
import Logger from '../utils/Logger';

const filePath = path.join(__dirname, './../assets/AccountConfirmation.html');
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
    body: string;
    attachments?: IMailAttachment[];
}

export interface IMail {
    header: IMailHeader;
    body: IMailBody;
}

class EmailService implements IMail {
    private logger = new Logger();
    private errorHandler = new ErrorHandler();
    private transporter: Transporter;
    header: IMailHeader;
    body: IMailBody;

    constructor(email: IMail) {
        this.header = email.header;
        this.body = email.body;

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            secure: true,
            auth: {
                user: sanitizedConfig.GMAIL_EMAIL,
                pass: sanitizedConfig.GMAIL_PASSWORD,
            },
        });
    }

    public async sendMail(): Promise<boolean> {
        try {
            const mailOptions = {
                from: this.header.from,
                to: this.header.to,
                cc: this.header.cc,
                bcc: this.header.bcc,
                subject: this.header.subject,
                html: html.replace('{{activationLink}}', `${this.body}`),
                attachments: this.body.attachments,
            };

            const info = await this.transporter.sendMail(mailOptions);

            this.logger.info(info.response);
            return true;
        } catch (err) {
            this.errorHandler.handleError(err);
            return false;
        }
    }
}

export default EmailService;
