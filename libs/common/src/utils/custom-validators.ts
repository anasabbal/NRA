const allowedUserTypes = ['Driver', 'User']; // Define allowed user types

export function isValidUserType(value: any): boolean {
  return allowedUserTypes.includes(value);
}
