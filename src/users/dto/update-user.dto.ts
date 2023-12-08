import { IsString } from 'class-validator';
import { IsOptionalButOneOfRequired } from '../is-optional-but-one-of-required.decorator';

export class UpdateUserDto {
  @IsString()
  @IsOptionalButOneOfRequired()
  username: string;
  @IsString()
  @IsOptionalButOneOfRequired()
  password: string;
}
