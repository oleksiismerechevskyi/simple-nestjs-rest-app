import { ValidateIf } from 'class-validator';

export const IsOptionalButOneOfRequired = () => {
  return ValidateIf(
    (dto: object, value: any) => !Object.values(dto).length || value,
  );
};
