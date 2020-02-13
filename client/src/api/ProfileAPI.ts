import API from './APIUtils';
import { IProfile } from '../types';

type Profile = {
  profile: IProfile;
};


export function getProfile(username: string) {
  return API.get<Profile>(`/profiles/${username}`);
}
