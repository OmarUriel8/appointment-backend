import { Appointment } from '../appointment/entities/appointment.entity';

export function toDate(time: string) {
  return new Date(`1970-01-01T${time}`);
}

export function generateSlots(start: string, end: string, minutes = 30) {
  const slots: string[] = [];

  let current = toDate(start);
  const endDate = toDate(end);

  while (current < endDate) {
    slots.push(current.toTimeString().slice(0, 5));
    current.setMinutes(current.getMinutes() + minutes);
  }

  return slots;
}

export function isFree(
  slot: string,
  appointments: Appointment[],
  idemployee: string,
  duration = 30,
) {
  const slotStart = toDate(`${slot}:00`);
  const slotEnd = new Date(slotStart);
  slotEnd.setMinutes(slotEnd.getMinutes() + duration);

  return !appointments.some((app) => {
    const idEmployeeApp = app.employee.id;
    const appStart = toDate(app.startTime);
    const appEnd = toDate(app.endTime);

    return (
      slotStart < appEnd && slotEnd > appStart && idemployee !== idEmployeeApp
    );
  });
}
