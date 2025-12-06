import { Transform } from 'class-transformer';

export const ToBoolean = () =>
  Transform(
    ({ value }) => {
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;
      }
      return value;
    },
    { toClassOnly: true },
  );
