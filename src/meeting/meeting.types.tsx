export type TVisibility = 'private' | 'code' | 'public';
export type TEdit = 'host' | 'participant' | 'user' | 'everyone';
export type TSort = 'custom' | 'title' | 'time' | 'single' | 'votes';

export interface IMeetingOverview {
  id: number;
  name: string;
  host: string;
  songs: number;
  participants: number;
}

export interface IMeetingInfo {
  id: number;
  name: string;
  host: string;
  visibility: TVisibility;
  edit: TEdit;
  sort: TSort;
  access?: string;
}

export interface IMeetingPermissions {
  edit?: boolean; // Tylko host (edycja śpiewanek)
  deleteSongs?: boolean; // Tylko host (usuwanie piosenek)
  deleteUsers?: boolean; // Tylko host (usuwanie użytkowników)
  vote?: boolean; // Tylko uczestnik spotkania (chyba że visibility = public, wtedy każdy zalogowany użytkownik)
  reorder?: boolean; // Tylko host
  songs?: boolean; // Tylko uczestnik spotkania (w zależności od edit: host — tylko host, participant — tylko uczestnik, user — każdy zalogowany użytkownik, everyone — każdy)
  invite?: boolean;  // Tylko host
}

export interface IMeeting extends IMeetingInfo {
  songs: IMeetingSong[];
  participants: string[];
  permissions: IMeetingPermissions;
  inMeeting?: boolean;
  isHost?: boolean;
}

export interface IMeetingSong {
  slug: string;
  title: string;
  user: string;
  time: number;
  votes?: number;
  voted?: boolean;
  hidden?: boolean;
}

export const visibilityText: Record<TVisibility, { text: string; helper: string }> = {
  private: {
    text: 'Prywatne',
    helper: 'Tylko ty i dodani przez Ciebie użytkownicy mogą zobaczyć te śpiewanki',
  },
  code: {
    text: 'Kod dostępu',
    helper: 'Użytkownicy mogą dołączyć (i zobaczyć śpiewanki) jeśli posiadają kod dostępu',
  },
  public: {
    text: 'Publiczne',
    helper: 'Wszyscy mogą zobaczyć te śpiewanki',
  },
};

export const editText: Record<TEdit, { text: string; helper: string }> = {
  host: {
    text: 'Tylko właściciel',
    helper: 'Tylko właściciel może dodawać/edytować listę',
  },
  participant: {
    text: 'Każdy uczestnik śpiewanek',
    helper: 'Tylko osoby, które dodałeś do śpiewanek',
  },
  user: {
    text: 'Każdy zalogowany użytkownik',
    helper: 'Każdy zalogowany użytkownik, który ma dostęp do śpiewanek',
  },
  everyone: {
    text: 'Każdy uczestnik śpiewanek',
    helper: 'Każdy (nawet niezalogowany) użytkownik',
  },
};

export const sortText: Record<TSort, { text: string; helper: string }> = {
  custom: {
    text: 'Własna kolejność',
    helper: 'Możliwość ręcznej zmiany kolejności',
  },
  title: {
    text: 'Alfabetycznie',
    helper: 'Kolejność alfabetyczna po tytule',
  },
  time: {
    text: 'Kolejność dodawania',
    helper: 'Po czasie dodania piosenki do śpiewanek',
  },
  single: {
    text: 'Kolejka piosenek',
    helper: 'Kolejka piosenek po jednej na użytkownika',
  },
  votes: {
    text: 'Głosowanie',
    helper: 'Po liczbie głosów - włącza możliwość głosowania na piosenki dla zalogowanych użytkowników',
  },
};
