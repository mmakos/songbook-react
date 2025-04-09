import { api } from '../http/api.ts';
import { IFastSearch } from './search.types.ts';

export const getAutocomplete = (key: string, setAutocomplete: (autocomplete: IFastSearch) => void) => {
  api.get(`autocomplete/?q=${key}`).then((response) => {
    setAutocomplete(response.data);
  });
};
