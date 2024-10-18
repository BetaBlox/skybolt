import * as bcrypt from 'bcryptjs';
import { User } from '@repo/database';
import { HookConfig } from '../hook.types';

export const UserHooks: HookConfig<User> = {
  name: 'User',
  modelName: 'User',

  async beforeCreate(data: User): Promise<User> {
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password, salt);
    return data;
  },
};
