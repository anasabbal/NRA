export enum DriverStatus {
    EMPTY = 'empty',
    ONE_SET_AVAILABLE = 'one_set_available',
    TWO_SET_AVAILABLE = 'two_set_available',
    THREE_SET_AVAILABLE = 'three_set_available'
}

export namespace DriverStatusType {
    export function getValues(): any{
        return Object.values(DriverStatus).filter(value => typeof value === 'string');
    }
    export function isValid(value: string): boolean {
        return getValues().includes(value);
    }
}
  