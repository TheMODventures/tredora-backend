export class OtpUtils {
  static generateOtp(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1)).toString();
  }

  static generateOtpExpiry(minutes: number = 10): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
  }

  static isOtpExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}