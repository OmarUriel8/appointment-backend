// export const validateNotPast = (date: Date, startTime: string) => {

//   // Crear fecha completa
//   const [hours, minutes] = startTime.split(':').map(Number);

//   const fullDate = new Date(date);
//   fullDate.setHours(hours, minutes, 0, 0);

//   const now = new Date();

//   if (fullDate < now) {
//     return false;
//   }

//   return true;
// };

export const validateNotPast = (
  dateStr: string,
  startTime: string,
): boolean => {
  // 1. Crear una fecha ISO completa con la hora de inicio en la zona horaria
  //    del servidor (America/Mexico_City, debido a TZ).
  //    La variable 'dateStr' es el input del usuario (ej: 2025-12-04)
  //    NOTA: Si el input 'date' es un objeto Date, primero conviértelo a string.

  // Asumiré que el input 'dateStr' es una fecha ISO-8601 (2025-12-04)
  // y lo combinaré con 'startTime'. Si el input es un objeto Date,
  // usa new Date(date.toISOString().split('T')[0] + 'T' + startTime)

  const fullDateStr = `${dateStr.split('T')[0]}T${startTime}:00`;
  const fullDate = new Date(fullDateStr);

  // 2. Obtener el tiempo actual del servidor (siempre en UTC internamente)
  const now = new Date();

  // 3. Comparar los timestamps UTC
  //    fullDate.getTime() vs now.getTime()
  //    Si fullDate (hora de México) < now (hora de México), devuelve false
  //    Si usas fullDate < now, JavaScript compara los timestamps UTC internos.

  // Comprobación de que la fecha del usuario no está en el pasado absoluto (UTC).
  // Esta es la forma más limpia y estándar.
  if (fullDate.getTime() < now.getTime()) {
    return false;
  }

  return true;
};
