'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.MailService = void 0;
const common_1 = require('@nestjs/common');
const nodemailer = require('nodemailer');
let MailService = class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }
  async sendVerificationEmail(to, code) {
    try {
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject: 'Email Verification',
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate(
  [(0, common_1.Injectable)(), __metadata('design:paramtypes', [])],
  MailService,
);
//# sourceMappingURL=mail.service.js.map
