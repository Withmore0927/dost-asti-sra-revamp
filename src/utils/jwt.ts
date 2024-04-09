import jwt, { JsonWebTokenError, JwtPayload, SignOptions } from 'jsonwebtoken';

const generate = async (
  payload: JwtPayload,
  secret: string,
  options: SignOptions,
): Promise<string | undefined | JsonWebTokenError> => {
  try {
    return await new Promise((resolve, reject) => {
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error(String(error));
  }
};

const verify = (
  payload: string,
  secret: string,
): Promise<{
  error: boolean;
  value: any;
}> =>
  new Promise((resolve, reject) => {
    jwt.verify(payload, secret, (err, token) => {
      if (err) resolve({ error: true, value: err });
      resolve({ error: false, value: token });
    });
  });

export default { verify, generate } as const;
