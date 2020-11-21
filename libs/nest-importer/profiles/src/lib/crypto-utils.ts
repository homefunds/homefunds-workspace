import * as crypto from 'crypto';

const algorithm = 'aes-256-ctr';

export function encrypt(password: string, text: string): string {
  if (text) {
    var cipher = crypto.createCipher(algorithm, password);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  }
  return '';
}

export function decrypt(password: string, text: string) : string {
  if (text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
  }

  return '';
}
