import type { PageServerLoad } from './$types';
import { characters } from 'phosart-common/server';

export const load: PageServerLoad = async () => {
  return {
    characters: await characters()
  };
};
