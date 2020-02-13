import React from 'react';
import { Link } from '@reach/router';
import { IModel } from '../types';
import { ModelListAction } from '../reducers/modelList';
import { Card, Icon, message, Popconfirm } from 'antd';
import { deleteModel } from '../api/ModelsAPI';
const { Meta } = Card;
type ModelPreviewProps = {
  model: IModel;
  needRefreshCount: number;
  dispatch: React.Dispatch<ModelListAction>;
};

export default function ModelPreview({
  model,
  needRefreshCount,
  dispatch,
}: ModelPreviewProps) {
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  const handleDelete = () => {
    deleteModel(model.slug).then(() => {
      message.success('删除成功！');
      setConfirmVisible(false);
      dispatch({ type: 'UPDATE_REFRESH', needRefreshCount: needRefreshCount + 1 });
    });
  };
  const toggleConfirmVisible = () => {
    setConfirmVisible(true);
  }

  return (
    <div className="model-preview">
      <Card hoverable={true} bordered={false}
        actions={[
          <Popconfirm className="preview-link" placement="top" title={'确认删除此模块？'} visible={confirmVisible}
            onConfirm={handleDelete} onCancel={() => { setConfirmVisible(false) }} okText="删除" cancelText="取消">
            <div className="rightContainer" onClick={toggleConfirmVisible} >
              <Icon type="delete" key="delete" />,
          </div>
          </Popconfirm>,
          <Link to={`/modelEditor/${model.slug}`} >
            <Icon type="setting" key="setting" />
          </Link>,
        ]}
      >
        <Link to={`/notes/${model.slug}`} className="preview-link">
          <Meta
            title={model.name}
            description={model.desc || ' '}
          />
        </Link>
      </Card>
    </div >
  );
}
