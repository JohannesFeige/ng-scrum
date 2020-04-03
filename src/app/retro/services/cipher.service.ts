import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class CipherService {
  constructor() {}

  encrypt(secret: string, message: string): string {
    return AES.encrypt(message, secret).toString();
  }

  decrypt(secret: string, cipherText: string): string {
    const bytes = AES.decrypt(cipherText, secret);
    return bytes.toString(enc.Utf8);
  }

  generateSecret(): string {
    const random = Math.random().toString();
    const randomKey = Math.random().toString();

    return AES.encrypt(random, randomKey).toString();
  }
}
