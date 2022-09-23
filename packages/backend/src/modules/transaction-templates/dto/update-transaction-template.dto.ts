import { UpdateTransactionTemplateDto as SharedUpdateTransactionTemplateDto } from '@local/types';
import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

import { ObjectId } from '../../../types/objectId';
import { IsInstanceOfObjectIdArray } from '../../../utils/is-instance-of-object-id-array.decorator';
import { IsInstanceOfObjectId } from '../../../utils/is-instance-of-object-id.decorator';
import {
  objectIdArrayTransformer,
  objectIdTransformer,
} from '../../../utils/object-id-transformer';

class TmpClass extends SharedUpdateTransactionTemplateDto<ObjectId> {}

export class UpdateTransactionTemplateDto extends PartialType(TmpClass) {
  @IsOptional()
  @IsInstanceOfObjectId({
    message: 'fromAccount must be formatted as objectId.',
  })
  @Transform(objectIdTransformer)
  readonly fromAccount?: ObjectId | null;

  @IsOptional()
  @IsInstanceOfObjectId({ message: 'toAccount must be formatted as objectId.' })
  @Transform(objectIdTransformer)
  readonly toAccount?: ObjectId | null;

  @IsOptional()
  @IsInstanceOfObjectIdArray({
    message: 'categories must be formatted as array of objectIds.',
  })
  @Transform(objectIdArrayTransformer)
  @ValidateNested({ each: true })
  categories?: ObjectId[] | null;
}