import React from 'react';
import ListPagination from './ListPagination';
import {
  getModels,
} from '../api/ModelsAPI';
import useModels from '../context/models';
import ModelPreview from './ModelPreview';

const loadModels = (page = 0) => {
  return getModels(page);
};

export default function ModelList() {
  const {
    state: { models, loading, needRefreshCount, totalCount, page },
    dispatch,
  } = useModels();

  React.useEffect(() => {
    let ignore = false;
    async function fetchModels() {
      dispatch({ type: 'FETCH_MODELS_BEGIN' });
      try {
        const payload = await loadModels(page);
        if (!ignore) {
          dispatch({ type: 'FETCH_MODELS_SUCCESS', payload: payload.data });
        }
      } catch (error) {
        if (!ignore) {
          dispatch({ type: 'FETCH_MODELS_ERROR', error });
        }
      }
    }
    fetchModels();
    return () => {
      ignore = true;
    };
  }, [dispatch, needRefreshCount, page]);

  if (loading) {
    return <div className="model-preview">Loading...</div>;
  }

  if (models.length === 0) {
    return <div className="model-preview">No models are here... yet.</div>;
  }

  return (
    <React.Fragment>
      {models.map((model) => (
        <ModelPreview
          needRefreshCount={needRefreshCount}
          key={model.slug}
          model={model}
          dispatch={dispatch}
        />
      ))}
      <ListPagination
        page={page}
        totalCount={totalCount}
        dispatch={dispatch}
      />
    </React.Fragment>
  );
}
