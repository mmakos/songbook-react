import { IBand, IPerson, ISource } from '../../types/song.types.ts';
import { api } from '../../http/api.ts';

export const getPersonAutocomplete = (key: string, setPeople: (people: IPerson[]) => void) => {
  api.get(`person/?q=${key}`).then((response) => {
    setPeople(response.data);
  });
};

export const getBandAutocomplete = (key: string, setBands: (bands: IBand[]) => void) => {
  api.get(`band/?q=${key}`).then((response) => {
    setBands(response.data);
  });
};

export const getSourceAutocomplete = (key: string, setSources: (sources: ISource[]) => void) => {
  api.get(`source/?q=${key}`).then((response) => {
    setSources(response.data);
  });
};
