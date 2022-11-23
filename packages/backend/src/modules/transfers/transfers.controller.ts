import { AccountType } from '@local/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { ObjectId, parseObjectId } from '../../types/objectId';
import { ValidateEntityId } from '../../utils/validate-entity-id.pipe';
import { LoggedIn } from '../auth/decorators/loggedIn.decorators';
import { UserId } from '../users/users.decorators';

import { CreateTransferDto } from './dto/create-transfer.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
import { TransfersService } from './transfers.service';

@Controller('api/transfers')
@LoggedIn()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get()
  async findAllByUser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
    )
    accountTypes?: AccountType[],
  ) {
    return this.transfersService.findAllByUser(
      userId,
      page,
      limit,
      year,
      month,
      accountTypes,
    );
  }

  @Get('monthly-summaries')
  async findMonthlySummariesByuser(
    @UserId() userId: ObjectId,
    @Query('month') month: number,
    @Query('year') year: number,
    @Query('limit') limit: number,
    @Query(
      'accountTypes',
      new ParseArrayPipe({ separator: '|', optional: true }),
    )
    accountTypes?: AccountType[],
    @Query(
      'transactionCategories',
      new ParseArrayPipe({
        separator: '|',
        optional: true,
      }),
    )
    transactionCategories?: string[],
    @Query('parentTransactionCategory', ValidateEntityId)
    parentTransactionCategory?: ObjectId,
  ) {
    return this.transfersService.findMonthlySummariesByUser(
      userId,
      limit,
      year,
      month,
      accountTypes,
      transactionCategories?.map((id) => parseObjectId(id)),
      parentTransactionCategory,
    );
  }

  @Get(':id')
  async findOne(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transfersService.findOne(userId, id);
  }

  @Post()
  async create(
    @UserId() userId: ObjectId,
    @Body() createTransfer: CreateTransferDto,
  ) {
    return this.transfersService.create(userId, createTransfer);
  }

  @Patch(':id')
  update(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
    @Body() updateTransactionDto: UpdateTransferDto,
  ) {
    return this.transfersService.update(userId, id, updateTransactionDto);
  }

  @Delete(':id')
  remove(
    @UserId() userId: ObjectId,
    @Param('id', ValidateEntityId) id: ObjectId,
  ) {
    return this.transfersService.remove(userId, id);
  }
}
