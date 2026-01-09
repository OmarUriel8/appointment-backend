import { UserRole } from '@/user/enums/user-role.enum';

export interface JwtPayload {
  email: string;
  name: string;
  role: UserRole;
}
