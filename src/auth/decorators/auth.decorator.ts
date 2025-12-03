import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';

/**
 * AuthGuard(): Este es el Guard de autenticación de @nestjs/passport (por ejemplo, AuthGuard('jwt')). Se encarga de validar el token de autenticación (ej. JWT) y adjuntar el objeto User al req.user. Este paso debe ejecutarse antes de UserRoleGuard.
 */

export const Auth = (...roles: UserRole[]) => {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
};
