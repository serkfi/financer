import { OmitType } from '@nestjs/swagger';

import { IncomeDto } from './income.dto';

export class CreateIncomeDto extends OmitType(IncomeDto, [
  'id',
  'userId',
  'v',
  'createdAt',
  'updatedAt',
] as const) {}
