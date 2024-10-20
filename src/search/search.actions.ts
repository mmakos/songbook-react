import { HttpService } from '../http/http.service.ts';
import { IFastSearch } from './search.types.ts';

export const getAutocomplete = (key: string, setAutocomplete: (autocomplete: IFastSearch) => void) => {
  HttpService.get(`autocomplete/?q=${key}`).then((response) => {
    setAutocomplete(response.data);
  });
};
