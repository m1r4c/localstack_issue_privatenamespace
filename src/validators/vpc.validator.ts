import validator from 'validator';

export function isValidNetworkIpAddress(input: string): boolean {
  return validator.isIP(input);
}

export function isValidNetworkMask(input: number): boolean {
  return input >= 16 && input <= 20;
}
