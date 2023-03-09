import * as fs from 'fs';
import { Transporter } from 'nodemailer';
import * as path from 'path';
import { CEmailException } from '../errors/CEmailException';

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
    body: string;
    attachments?: IMailAttachment[];
}

export interface IMailService {
    sendMail(header: IMailHeader, body: IMailBody): Promise<boolean>;
}

export class CEmailService implements IMailService {
    private transporter: Transporter;

    constructor(transporter: Transporter) {
        this.transporter = transporter;

        this.transporter.on('error', (err: Error) => {
            if (err) {
                throw new CEmailException(400, err.message);
            }
        });
    }

    public async sendMail(header: IMailHeader, body: IMailBody): Promise<boolean> {
        const mailOptions = {
            from: header.from,
            to: header.to,
            cc: header.cc,
            bcc: header.bcc,
            subject: header.subject,
            html: html.replace('{{activationLink}}', `${body}`),
            attachments: body.attachments,
        };

        const email = await this.transporter.sendMail(mailOptions);
        return email?.response.split(' ')[2] === 'OK';
    }
}
