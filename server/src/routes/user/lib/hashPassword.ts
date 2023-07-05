import { scrypt } from 'node:crypto';

export const hashPassword = async (password: string, salt: string): Promise<string> =>
    new Promise((resolve, reject) => {
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
