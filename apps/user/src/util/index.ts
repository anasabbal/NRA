import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';



export function mapDto<T extends Record<string, any>, U extends Record<string, any>>(source: T): U {
    const result = {} as U;
  
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        result[key as keyof U] = source[key] as unknown as U[keyof U];
      }
    }
  
    return result;
}



export function IsEqualTo(property: string, validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
}
  