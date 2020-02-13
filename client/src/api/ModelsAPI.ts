import API from './APIUtils';
import { IModel, IAdmin } from '../types';

const encode = encodeURIComponent;

type Models = {
  models: Array<IModel>;
} & {
  totalCount: number;
};

type Model = {
  model: IModel;
};

function limit(count: number, p: number) {
  return `limit=${count}&offset=${p ? p * count : 0}`;
}

function omitSlug(model: {
  slug: string;
  name?: string;
  desc?: string;
}) {
  return Object.assign({}, model, { slug: undefined });
}

export function getModels(page: number) {
  return API.get<Models>(`/models?${limit(10, page)}`);
}

export function getModelsByCreator(username: string, page: number) {
  return API.get<Models>(
    `/models?creator=${encode(username)}&${limit(5, page)}`,
  );
}


export function deleteModel(slug: string) {
  return API.delete<null>(`/models/${slug}`);
}


export function getModel(slug: string) {
  return API.get<Model>(`/models/${slug}`);
}

export function updateModel(model: {
  slug: string;
  name: string;
  desc: string;
}) {
  return API.put<Model>(`/models/${model.slug}`, {
    model: omitSlug(model),
  });
}

export function createModel(model: {
  name: string;
  desc: string;
}) {
  return API.post<Model>('/models', { model });
}
