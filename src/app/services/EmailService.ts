import * as fs from 'fs';
import nodemailer, { Transporter } from 'nodemailer';
import * as path from 'path';
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
                user: process.env.GMAIL_EMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
    }

    public async sendMail(): Promise<boolean> {
        let success = true;
        let menssage = 'Email sent successfully';

        const mailOptions = {
            from: this.header.from,
            to: this.header.to,
            cc: this.header.cc,
            bcc: this.header.bcc,
            subject: this.header.subject,
            html: html.replace('{{activationLink}}', `${this.body}`),
            attachments: this.body.attachments,
        };

        await this.transporter.sendMail(mailOptions).catch((error: Error) => {
            if (error) {
                menssage = error.message;
                success = false;
            }
        });

        if (!success) {
            throw new ErrorHandler(400, menssage);
        }

        this.logger.info(menssage);
        return success;
    }
}

export default EmailService;
