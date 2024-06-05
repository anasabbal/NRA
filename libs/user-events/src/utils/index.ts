



export function mapDto<T extends Record<string, any>, U extends Record<string, any>>(source: T): U {
    const result = {} as U;
  
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        result[key as keyof U] = source[key] as unknown as U[keyof U];
      }
    }
  
    return result;
}
  