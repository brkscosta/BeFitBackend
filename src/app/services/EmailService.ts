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

interface IMail {
    header: IMailHeader;
    body: IMailBody;
}

class EmailService {
    private email: IMail;

    constructor(email: IMail) {
        this.email = email;
    }

    sendMail() {
        console.log(this.email);
    }
}

export default EmailService;
