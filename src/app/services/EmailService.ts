import Logger from '../utils/Logger';

interface IMailAttachment {
    filename: string;
    path: string;
    contentType: string;
}

export interface IMailHeader {
    from: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
}

export interface IMailBody {
    body: string;
    attachments?: IMailAttachment[];
}

export interface IMail {
    header: IMailHeader;
    body: IMailBody;
}

class EmailService {
    private email: IMail;
    private logger = new Logger();

    constructor(email: IMail) {
        this.email = email;
    }

    sendMail() {
        this.logger.info('Email was sent!');
    }

    getMail(): IMail {
        return this.email;
    }
}

export default EmailService;
