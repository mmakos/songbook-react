import { IBand, IPerson, ISource } from '../../types/song.types.ts';
import { HttpService } from '../../http/http.service.ts';

export const getPersonAutocomplete = (key: string, setPeople: (people: IPerson[]) => void) => {
  HttpService.get(`person/?q=${key}`).then((response) => {
    setPeople(response.data);
  });
};

export const getBandAutocomplete = (key: string, setBands: (bands: IBand[]) => void) => {
  HttpService.get(`band/?q=${key}`).then((response) => {
    setBands(response.data);
  });
};

export const getSourceAutocomplete = (key: string, setSources: (sources: ISource[]) => void) => {
  HttpService.get(`source/?q=${key}`).then((response) => {
    setSources(response.data);
  });
};
