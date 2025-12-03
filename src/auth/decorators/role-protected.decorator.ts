import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';

export const META_ROLES = 'roles'; // ? Es la clave que se utiliza para almacenar los metadatos de los roles.
/**
 * ? Especificar qué roles de usuario están autorizados para acceder a un endpoint (ruta) particular.
 */
export const RoleProtected = (...args: UserRole[]) => {
  return SetMetadata(META_ROLES, args); // ? SetMetadata asocia lista de roles con la clave META_ROLES
};
