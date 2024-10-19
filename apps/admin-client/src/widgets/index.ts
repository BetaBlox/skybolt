import { ImpersonateUserCard } from '@/widgets/users/impersonate-user-card';
import { UpdatePasswordCard } from '@/widgets/users/update-password-card';

const widgets: Record<string, React.ElementType> = {
  // User widgets
  UpdatePasswordCard: UpdatePasswordCard,
  ImpersonateUserCard: ImpersonateUserCard,
};

export { widgets };
