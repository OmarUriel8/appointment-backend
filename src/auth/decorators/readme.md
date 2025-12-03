# Funcionamiento de los decoradores para autenticacion y autorizacion

```
  @Get('check-status')
  @Auth(UserRole.ADMIN) // <--- Se ejecuta primero
  findAll(@GetUser() user: User) { // <--- Se ejecuta al final, después de los Guards
    // ... lógica de servicio
  }

```

1.  Decorador `@Auth(UserRole.ADMIN)`: Ejecuta los Guards.

- A) `AuthGuard():` Valida el token y, si es exitoso, adjunta el objeto `user` al request.

- B) `UserRoleGuard`:
  - Usa `Reflector` para leer el metadato establecido por `@RoleProtected(UserRole.ADMIN)`.

  - Verifica si `req.user` (establecido en el Paso A) existe y si `req.user.role` es `ADMIN`.

  - Si es válido, continúa. Si no, detiene la petición con un error 403.

2. Decorador `@GetUser()`: Si los Guards permitieron la ejecución, el decorador de parámetro extrae el objeto `user` (que ya está en el request) y lo inyecta como argumento a la función `findAll`.

3. Ejecución del Método: El método `findAll` se ejecuta con el objeto `user` disponible.
