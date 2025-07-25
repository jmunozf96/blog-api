import bcrypt from 'bcrypt';

describe('Password Hasher (bcrypt)', () => {
  const plainPassword = '123456';

  it('should hash password and validate with compare', async () => {
    const hash = await bcrypt.hash(plainPassword, 10);
    console.log(hash);
    expect(hash).not.toEqual(plainPassword);

    const isValid = await bcrypt.compare(plainPassword, hash);
    expect(isValid).toBe(true);
  });

  it('should fail validation with wrong password', async () => {
    const hash = await bcrypt.hash(plainPassword, 10);

    const isValid = await bcrypt.compare('ContraseñaMala', hash);
    expect(isValid).toBe(false);
  });
});