import React from 'react';
import { modelEditorReducer, initalState } from '../reducers/modelEditor';
import { RouteComponentProps } from '@reach/router';
import { getModels, getModel, updateModel, createModel } from '../api/ModelsAPI';
import ListErrors from './common/ListErrors';
import { routeJump } from '../utils';
import { message } from 'antd';

export default function ModelEditor({
  slug = '',
}: RouteComponentProps<{ slug: string }>) {
  const [state, dispatch] = React.useReducer(modelEditorReducer, initalState);
  React.useEffect(() => {
    let ignore = false;

    const fetchModel = async () => {
      try {
        const payload = await getModel(slug);
        const { name, desc } = payload.data.model;
        if (!ignore) {
          dispatch({
            type: 'SET_FORM',
            form: { name, desc },
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (slug) {
      fetchModel();
    }
    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // @ts-ignore
    dispatch({
      type: 'UPDATE_FORM',
      field: {
        key: event.currentTarget.name,
        value: event.currentTarget.value,
      },
    });
  };


  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const { name, desc } = state.form;
      const model = { name, desc };
      let payload;
      if (slug) {
        payload = await updateModel({ slug, ...model });
        message.success('模块信息修改成功！');
      } else {
        payload = await createModel(model);
        message.success('新增模块成功！');
      }
      routeJump(`/`);
    } catch (error) {
      console.log(error);
      if (error.status === 422) {
        dispatch({ type: 'SET_ERRORS', errors: error.data.errors });
      }
    }
  };
  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <ListErrors errors={state.errors} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  name="name"
                  className="form-control"
                  type="text"
                  placeholder="模块名称"
                  value={state.form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <textarea
                  name="desc"
                  className="form-control"
                  rows={5}
                  placeholder="模块描述"
                  value={state.form.desc}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button
                className="btn btn-lg pull-xs-right btn-primary"
                type="submit"
              >
                {slug ? '更新模块' : '创建模块'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
