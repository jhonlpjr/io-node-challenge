import { inject, injectable } from "inversify";
import { AccountRepository } from "../../domain/repository/account.repository";
import { TYPES } from "../../infraestructure/containers/inversify.constant";
import { AccountObtainedResDto } from "../dtos/response/account-obtained.res.dto";
import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({ serviceName: 'GetAccountUsecase' });

@injectable()
export class GetAccountUsecase {
  constructor(
    @inject(TYPES.AccountRepository) private accountRepository: AccountRepository
  ) {}

  async execute(accountId: string): Promise<AccountObtainedResDto> {
    try {
      const validatedUser = await this.accountRepository.getAccount(accountId);
      logger.info('Account obtained', { accountId });
      if(!validatedUser) {
        return new AccountObtainedResDto({});
      }
      return new AccountObtainedResDto({id: validatedUser.id, amount: validatedUser.amount.toString()});
    } catch (error) {
      logger.error('Error obtaining account:', error as string | Error);
      return new AccountObtainedResDto({});
    }

  }
}