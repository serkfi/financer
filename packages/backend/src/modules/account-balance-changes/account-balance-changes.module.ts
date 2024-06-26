import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';

import { AccountBalanceChangesService } from './account-balance-changes.service';

@Module({
  imports: [DatabaseModule],
  providers: [AccountBalanceChangesService],
  exports: [AccountBalanceChangesService],
})
export class AccountBalanceChangesModule {}
