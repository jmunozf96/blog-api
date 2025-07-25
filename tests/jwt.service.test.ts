import { JwtService } from '../src/services/auth/jwt.service';
import jwt from 'jsonwebtoken';

describe('JwtService', () => {
  const payload = { userId: 1, email: 'test@example.com' };

  it('should sign and verify access token', () => {
    const token = JwtService.sign(payload);
    expect(typeof token).toBe('string');

    const decoded = JwtService.verify<typeof payload>(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it('should sign and verify refresh token', () => {
    const token = JwtService.signRefresh(payload);
    expect(typeof token).toBe('string');

    const decoded = JwtService.verifyRefresh<typeof payload>(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it('should throw error for invalid access token', () => {
    const fakeToken = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

    expect(() => JwtService.verify(fakeToken)).toThrow(/invalid signature/);
  });

  it('should throw error for expired token', (done) => {
    const shortToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: 1 }); // 1s

    setTimeout(() => {
      expect(() => JwtService.verify(shortToken)).toThrow(/jwt expired/);
      done();
    }, 1500);
  }, 5000); // aumenta timeout del test
});