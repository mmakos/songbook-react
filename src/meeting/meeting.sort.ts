import { IMeetingSong, TSort } from './meeting.types.tsx';

export const sortSongs = (songs: IMeetingSong[], sort: TSort): IMeetingSong[] => {
  songs = [...songs];
  if (sort === 'title') {
    songs.sort((s1, s2) => s1.title.localeCompare(s2.title));
  } else {
    songs.sort((s1, s2) => s1.time - s2.time);
    if (sort === 'votes') {
      songs.sort((s1, s2) => (s2.votes ?? 0) - (s1.votes ?? 0));
    } else if (sort === 'single') {
      songs = sortRoundRobin(songs);
    }
  }
  return songs;
};

const sortRoundRobin = (songs: IMeetingSong[]) => {
  const userQueues = new Map<string, IMeetingSong[]>();
  const userOrder: string[] = [];

  for (const song of songs) {
    if (!userOrder.includes(song.user)) {
      userOrder.push(song.user);
    }
    if (!userQueues.has(song.user)) {
      userQueues.set(song.user, []);
    }
    userQueues.get(song.user)!.push(song);
  }

  const result: IMeetingSong[] = [];
  let added;
  do {
    added = false;
    for (const user of userOrder) {
      const queue = userQueues.get(user);
      if (queue?.length) {
        result.push(queue.shift()!);
        added = true;
      }
    }
  } while (added);

  return result;
};
