import { INestApplication } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { AppModule } from '../src/app.module';
import { DatabaseService } from '../src/database/database.service';

loadEnv({ path: join(__dirname, '..', '..', '.env') });

const ensureEnv = (key: string, value: string) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
};

const log = (...args: unknown[]) => {
  console.info('[auth.e2e]', ...args);
};

const TEST_ACCESS_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDGgVYLr6k5yv0C
5Tdr+Qnwn2XoL3IokgBGeZqR9ZEH9Qy6P7V0mUTXPWrg9umYvQv5vMDd9SWT15Va
ULx+l74a5biGPnEyukmUaHe/1gNeIO9UNpeK9ppWfOCgorlJkGX89UtftFNlAG/V
uO0ioqhakrlXcFHGfG8UE9C5OWqWhRs5av4Sj60cRi+ojuN4n38Iq6D7NYViLLzv
z7LeKDYB4n6dJ+s5KDShLSizGbrhHQ8ijuZaLVyr1Plt9FLNqFPUV+VbjdUlB3dc
kTzICPAv75f7LQ6c7TCErZcXVuAnLqd5kh8QKLK7rUTwXB064Gflyrqci3nyuWuz
HpjT06yRAgMBAAECggEAJ2e259LGHJovgVdVIueEVGq6fsdvJfINEgErqE8aWUg+
Jg+zl4XcRkxbz8eVM9oS+6qZdzeoMBhZHEf8uS09MEkl9d4ebBz3KBipZH9Se8Pi
QXYh3PoW18aSVBHUcmjbF9KvidE1IOD9REm+jWpvlFEIz2+rcQM4cI6Bdq1PG6Uh
Z0slbGYcnCcg+8TtWgxFrUgbdl4P8HQU0dbTZiK1GWqQf9/AqK5Itv3QhkLmh9Ud
UcnY3E92r8rsT3N8gGTNXqUmdzjsj+ofhcO++AojWhwJuQkqenjy6knIVYT5Q8C0
lFTqFyxIlG+gxDoXMtk0Iqcr12cdXi38/Rm5+L5FEQKBgQD71tmD9XkmCEnRhysq
HHol+CGVqA7H6dXj8nWdXwBgHJPkE2sZHcxgFJFTIyP9Q1Sc+3TkpORDdU6IU9gN
qffEYHRSG93/WYNPR0a4gKav3VuQrDfrhr9buychChtgjYgIpbhYvTY8mKaFTxDY
TGxf0tdk5AcEgbs7jYhocFJB8wKBgQDNaf1wmfN5wSLb1U7NuRcFI9by/7cL2ysc
lo55xEzIvuexcHJOPPZVGUhSYo+oQ0MQrFcLNwZi27LCvgcJY7fI9H0JA4kujzGl
mVcnSNsvyazT/zhvu5gYv0nLXnQEf0UQcyAfynx1BjpG7PhB4F3o5LCdFTfhgMoQ
B0byBE/qXQKBgQCuCirvhghKv7z+astUuGxE2Z1rqZ616LoPh8tUl+cyTXsGIXMT
IKGxIz9pkMi9+yJ8+QMUZsDRcaf0tXfkT1mm3KDH+LovqCyQDRJodIN8cTeOBJ0n
83miBRUCNgKvrYe7CO6YfTnKs/uSHPae1hI2SdPD0+25pLncTEg8v+9wfwKBgQCd
yY7rDeCrrLxYGCnyIrg9FFekY8YCRh/CxDPsRS2u+VaI9f30JYgPeR5gm5lQWr09
zNRPx/tEdFpL4dlT8hx4A63Cz1h+l380fZursR6kxZSee9JtGu1OkiVTLd5czZLk
YPVFTntEv5JprecWz9JxtV8Q78r7ay9pWnTVcR4hMwKBgQCB2Mlz2NtAo/tZuvic
W2ksby2nmF2WQdcbgNKVY7Cx8VExQzHnPiHg8o5kBg9WeSC9pnxrPxzOzo6slfDY
NvBMeGo1QVFhfjqlBWlZHwxRMDNz4lwOzXAtIR41uBeDsYheLzh/TbqXWdTTlLOZ
XwF2dbUlptatkznSCFxAD3hXaQ==
-----END PRIVATE KEY-----
`;

const TEST_ACCESS_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxoFWC6+pOcr9AuU3a/kJ
8J9l6C9yKJIAQnmakfWRB/UMuj+1dJlE1z1q4PbpmL0L+bzA3fUlk9eVWhQvH6Xv
hlluIY+cTLpJlGh3v9YDXiDvVDaXivaaVnzgYKK5SZZBl/PVLX7RTZQBv1bjtIqK
oWpK5V3BRxnxvFBPQuTlqloUbOWr+Eo+tHEYvoo7jeJ9/CKug+zWFYiy4878+y3i
g2AeJ+nSfrOSg0oS0osxm64R0PIo7mWi1cq9T5bfRSzahT1FflW43VJQd3XJE8yA
8C/vl/stDpztMIStlxdW4Ccup3mSHxAosrutRPMcdOuBn5cq6nIt58rlrsx6Y09O
skQIDAQAB
-----END PUBLIC KEY-----
`;

const TEST_REFRESH_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBALYvpReWm6O3gTsW
e4gKX86GRLFG59VQrA0usmQhzwHcKfkiYlzSTCpVKjjEftC7FxydXSBrwDV4dzNZ
SaUFoj7Ekf0VF8rbLdu0yLsRxEr1Mllx3kwW8180TNfp2bORMX5oJSGEWB173L/6
s9HTwcGk8iLhnfHHa1uXC1gxjmI7AgMBAAECgYBnSzUsRK3IV/9T4tMFd3s2oItu
uCgEoDdX6kaj3mXTxzpbyWz2dQ+sn0sw7hJh4v8JUQQfq9wSl67hMMA9EAQn3yVP
I+0yIIpk5nl3XVrFVfrIb0x3c8ElCVWd6PZ2aL6GGZ8cFLvoD28v37/lEQ0mlw3T
ST9p8PGuxm9ivzENYQJBAN/UBl7uOtXSRU5OOmngoD1NOIpQWs2HChZ7WrU6Fo27
Y8fv5tdJ2zVLBBgNm3rGbxXeWdAt/6X+Ns8tYD7D2LsCQQDSf3JW88Nu/0MVZwZ9
DyNZxpgQbEFgH9ms/ZaiYrKpAo51pkIKhnyNcxvDr6o0ZA1wT5BtLKe4k3FuWc3Z
KZb/AkAMQ0XnYNGr+frJjYZqS3pgWkSajVNQXG60FYt9Jc5PNXJNV8l6roTjEsTt
h61Vwh7yLeRSlX5/K63YO0pzQMybAkBAQzkRRxjjhmX6ZvaF4iTzZicX9hZWzmxT
vFCLL3jbQV5Rj7oy3zGpoQxEQMlztJ6K8aL2ZGv9wyUO1HUMaqh1AkAT0GhCVW63
noos1KUamxKpCrh8YJr5dWuYwoo7YhMzbYKnxepzb/LPlCU11S3AwbIqjoUoI+h2
uspxnSuuzLCm
-----END PRIVATE KEY-----
`;

const TEST_REFRESH_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2L6UXlpujt4E7FnuICl/OhkSx
RufVUKwNLrJkIc8B3Cn5ImJc0kwqVSo4xH7QuxccnV0ga8A1eHczWUmFBaI+xJH9
FRfK2y3btMi7EcRK9TJZcd5MFvNfNEzX6dmzkTF+aCUhhFgdexy/+rPR08HBpPIi
4Z3xx2tblwtYMY5iOwIDAQAB
-----END PUBLIC KEY-----
`;

ensureEnv('JWT_ACCESS_PRIVATE_KEY', TEST_ACCESS_PRIVATE_KEY);
ensureEnv('JWT_ACCESS_PUBLIC_KEY', TEST_ACCESS_PUBLIC_KEY);
ensureEnv('JWT_REFRESH_PRIVATE_KEY', TEST_REFRESH_PRIVATE_KEY);
ensureEnv('JWT_REFRESH_PUBLIC_KEY', TEST_REFRESH_PUBLIC_KEY);

const sanitizePem = (value: string | undefined): string => value?.replace(/\\n/g, '\n') ?? '';

describe('Auth flows (e2e)', () => {
  let app: INestApplication;
  let httpServer: ReturnType<INestApplication['getHttpServer']>;
  let database: DatabaseService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    database = app.get(DatabaseService);
    jwtService = app.get(JwtService);
    httpServer = app.getHttpServer();

    await database.token.deleteMany();
    await database.user.deleteMany();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  const createCredentials = () => ({
    email: `test-user-${Date.now()}-${Math.random()}@example.com`,
    password: 'P@ssw0rd!',
  });

  it('enregistre un utilisateur puis permet la connexion avec retour des tokens', async () => {
    const credentials = createCredentials();

    log('register:start', { email: credentials.email });
    const registerResponse = await request(httpServer)
      .post('/auth/register')
      .send(credentials)
      .expect(201);
    log('register:success', { userId: registerResponse.body.user?.id });

    expect(registerResponse.body).toMatchObject({
      message: 'User successfully registered',
      user: expect.objectContaining({
        email: credentials.email.toLowerCase(),
        id: expect.any(Number),
      }),
    });

    log('login:start', { email: credentials.email });
    const loginResponse = await request(httpServer)
      .post('/auth/login')
      .send(credentials)
      .expect(200);
    log('login:success', { userId: loginResponse.body.user?.id });

    expect(loginResponse.body).toMatchObject({
      access_token: expect.any(String),
      token_type: 'Bearer',
      user: expect.objectContaining({
        email: credentials.email.toLowerCase(),
        id: expect.anything(),
      }),
    });

    const rawCookieHeader = loginResponse.headers['set-cookie'];
    const cookieArray = Array.isArray(rawCookieHeader)
      ? rawCookieHeader
      : rawCookieHeader
      ? [rawCookieHeader]
      : [];
    const refreshCookie = cookieArray.find((cookie) => cookie.startsWith('refresh_token='));
    expect(refreshCookie).toBeDefined();
    expect(refreshCookie).toContain('HttpOnly');

    const accessToken: string = loginResponse.body.access_token;
    log('login:verifyAccessToken:start');
    const payload = await jwtService.verifyAsync(accessToken, {
      algorithms: ['RS256'],
      publicKey: sanitizePem(process.env.JWT_ACCESS_PUBLIC_KEY),
    });
    log('login:verifyAccessToken:success', { subject: payload.sub, roles: payload.roles });

    expect(payload).toMatchObject({
      email: credentials.email.toLowerCase(),
      sub: String(loginResponse.body.user.id),
      roles: expect.arrayContaining(['user']),
    });
  });

  it('refuse la connexion avec un mot de passe invalide', async () => {
    const credentials = createCredentials();

    log('invalidPassword:register:start', { email: credentials.email });
    await request(httpServer).post('/auth/register').send(credentials).expect(201);
    log('invalidPassword:register:success');

    log('invalidPassword:loginAttempt:start');
    const failedLogin = await request(httpServer)
      .post('/auth/login')
      .send({ email: credentials.email, password: 'WrongPass123!' })
      .expect(401);
    log('invalidPassword:loginAttempt:failed', { statusCode: failedLogin.body.statusCode });

    expect(failedLogin.body).toMatchObject({
      statusCode: 401,
      message: 'Invalid credentials',
    });
  });
});
