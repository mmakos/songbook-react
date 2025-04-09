export const minError = (name: string, min: number) => {
  return `${name} musi mieć przynajmniej ${min} znaki`;
};

export const maxError = (name: string, max: number) => {
  return `${name} może mieć masymalnie ${max} znaków`;
};

export const validateString = <Name extends string>(
  str: string | undefined,
  name: Name,
  displayName: string,
  min: number,
  max: number,
  required?: boolean
): { [K in Name]?: string } => {
  const len = str?.trim().length ?? 0;
  if (len === 0) {
    if (required) return { [name]: `Pole jest wymagane` } as { [K in Name]?: string };
    else return {};
  }
  if (len < min) return { [name]: minError(displayName, min) } as { [K in Name]?: string };
  else if (len > max) return { [name]: maxError(displayName, max) } as { [K in Name]?: string };
  return {};
};

export const validateHttpURL = (url?: string): { url?: string } => {
  const len = url?.trim().length ?? 0;
  if (len === 0) return {};
  if (len > 200) return { url: maxError('Adres url', 200) };
  try {
    const newUrl = new URL(url!);
    if (newUrl.protocol !== 'http:' && newUrl.protocol !== 'https:') {
      return { url: 'Adres url musi być HTTP lub HTTPS' };
    }
  } catch (err) {
    return { url: 'Nieprawidłowy adres URL' };
  }
  return {};
};

export const validateChanged = (entityData: object, originalEntity: object): boolean => {
  for (const data in entityData) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (entityData[data] !== originalEntity[data]) {
      return true;
    }
  }
  return false;
};
