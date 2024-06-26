import { ApiProperty } from '@nestjs/swagger';
import { Account, AccountType } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class AccountDto implements Account {
  v: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  @IsString()
  readonly name: string;

  @ApiProperty({
    enum: AccountType,
    enumName: 'AccountType',
    type: AccountType,
  })
  @IsEnum(AccountType, {
    message: `Type must be one of the following: ${Object.values(AccountType).join(', ')}.`,
  })
  readonly type: AccountType;

  @ApiProperty()
  @IsNumber({}, { message: 'Balance must be a number.' })
  readonly balance: number;

  @ApiProperty({ type: String })
  @IsMongoId()
  readonly userId: string;

  @ApiProperty()
  @IsBoolean()
  isDeleted: boolean;
}
