export declare class MailService {
    private transporter;
    constructor();
    sendVerificationEmail(to: string, code: string): Promise<void>;
}
