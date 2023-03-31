import { User } from './../interfaces/user';
import { Member } from './../interfaces/member';
import { Amount } from './../interfaces/amount';
import { DBCrud } from '../classes/db-crud';
import { AppConfig } from '../app-config';

export class UsersService extends DBCrud {
	protected PATH = AppConfig.PATH_USERS;

	public rechargeBalance(id: Member['id'], amount: Amount) {
		return new Promise<void>(async (resolve, reject) => {
			try {
				const { balance } = (await this.get(id)) as Member;
				if (balance.coin !== amount.coin)
					throw 'Cannot add value to balance in this currency';

				const newBalance = {
					value: balance.value + amount.value,
					coin: AppConfig.DEFAULT_CURRENCY,
				};

				this.set({ balance: newBalance }, id);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	public withdrawBalance(id: Member['id'], amount: Amount) {
		return new Promise<void>(async (resolve, reject) => {
			try {
				const { balance } = (await this.get(id)) as Member;
				if (balance.coin !== amount.coin)
					throw 'Cannot withdraw value to balance in this currency';

				if (balance.value < amount.value)
					throw 'Balance is not enough to withdraw';

				const newBalance = {
					value: balance.value - amount.value,
					coin: AppConfig.DEFAULT_CURRENCY,
				};

				this.set({ balance: newBalance }, id);
				resolve();
			} catch (error) {
				reject(error);
			}
		});
	}

	public getOne(id: User['id']) {
		return this.get(id);
	}

	public setOne(data: any, id: User['id']) {
		return this.set(data, id);
	}

	public deleteOne(id: User['id']) {
		return this.delete(id);
	}
}
