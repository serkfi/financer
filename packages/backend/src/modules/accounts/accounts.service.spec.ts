import { forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { removeCreatedAndUpdated } from '../../../test/test-helper';
import { DUMMY_TEST_USER } from '../../config/mockAuthenticationMiddleware';
import { testConfiguration } from '../../config/test-configuration';
import { DatabaseModule } from '../../database/database.module';
import fixtureData from '../../fixtures/large_fixture-data.json';
import { AccountBalanceChangesModule } from '../account-balance-changes/account-balance-changes.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UserDataModule } from '../user-data/user-data.module';
import {
  ImportUserDataDto,
  UserDataService,
} from '../user-data/user-data.service';

import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [testConfiguration] }),
        DatabaseModule,
        AccountBalanceChangesModule,
        forwardRef(() => TransactionsModule),

        // Modules required to bootstrap with UserDataModule
        UserDataModule,
      ],
      providers: [AccountsService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    const userDataService = module.get<UserDataService>(UserDataService);

    await userDataService.overrideUserData(
      DUMMY_TEST_USER.id,
      fixtureData as unknown as ImportUserDataDto,
    );
  }, 10000);

  it('should return an array of accounts from findAllByUser', async () => {
    const accounts = await service.findAllByUser(DUMMY_TEST_USER.id);
    expect(removeCreatedAndUpdated(accounts)).toMatchSnapshot();
  });

  it('should return an account from findOne', async () => {
    const account = await service.findOne(
      DUMMY_TEST_USER.id,
      '61460d8554ea082ad0256759',
    );
    expect(removeCreatedAndUpdated(account)).toMatchSnapshot();
  });

  it('should return an array of account balance history from getAccountBalanceHistory', async () => {
    const accountBalanceHistory = await service.getAccountBalanceHistory(
      DUMMY_TEST_USER.id,
      '61460d8554ea082ad0256759',
    );
    expect(accountBalanceHistory).toMatchSnapshot();
  });
});
