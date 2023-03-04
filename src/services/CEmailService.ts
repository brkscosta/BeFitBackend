import * as fs from 'fs';
import nodemailer, { Transporter } from 'nodemailer';
import * as path from 'path';
import CEmailException from '../errors/CEmailException';
import { IEnverionmentVariables } from '../utils/CEnvironmentLoader';
import Logger from '../utils/CLogger';

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

export interface IMail {
    sendMail(header: IMailHeader, body: IMailBody): Promise<boolean>;
}

class CEmailService implements IMail {
    private logger: Logger;
    private environmentLoader: IEnverionmentVariables;
    private transporter: Transporter;

    constructor(logger: Logger, environmentLoader: IEnverionmentVariables) {
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

    public async sendMail(header: IMailHeader, body: IMailBody): Promise<boolean> {
        let success = true;
        let menssage = 'Email sent successfully';

        const mailOptions = {
            from: header.from,
            to: header.to,
            cc: header.cc,
            bcc: header.bcc,
            subject: header.subject,
            html: html.replace('{{activationLink}}', `${body}`),
            attachments: body.attachments,
        };

        await this.transporter.sendMail(mailOptions).catch((error: Error) => {
            if (error) {
                menssage = error.message;
                success = false;
            }
        });

        if (!success) {
            throw new CEmailException(400, menssage);
        }

        this.logger.info(menssage);
        return success;
    }
}

export default CEmailService;
