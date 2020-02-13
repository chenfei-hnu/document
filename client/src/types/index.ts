export interface IProfile {
  username: string;
  image: string;
}




export interface IAdmin {
  email: string;
  username: string;
  image: string;
}
export interface IModel {
  slug: string;
  name: string;
  desc: string;
  creator: IProfile;
}
export interface INote {
  slug: string;
  name: string;
  content: string;
  model: IModel;
  creator: IProfile;
}

export interface IErrors {
  [key: string]: string[];
}
