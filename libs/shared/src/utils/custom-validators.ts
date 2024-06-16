const allowedUserTypes = ['Driver', 'User'];

export function isValidUserType(value: any): boolean {
  return allowedUserTypes.includes(value);
}
