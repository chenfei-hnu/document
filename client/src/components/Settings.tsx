import React from 'react';
import { navigate, RouteComponentProps } from '@reach/router';
import ListErrors from './common/ListErrors';
import useAuth from '../context/auth';
import { updateAdmin, logout } from '../api/AuthAPI';
import { IErrors } from '../types';
import { message } from 'antd';
import { routeJump } from '../utils';


export default function Settings(_: RouteComponentProps) {
  const {
    state: { admin },
    dispatch,
  } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<IErrors | null>(null);
  const [form, setForm] = React.useState({
    username: '',
    email: '',
    image: '',
    password: '',
  });

  React.useEffect(() => {
    if (admin) {
      const { username, email, image } = admin;
      console.log(username, email, image);
      setForm({
        username,
        email,
        image: image || '',
        password: '',
      });
    }
  }, [admin]);

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    if (!form.password) {
      delete form.password;
    }
    try {
      const payload = await updateAdmin(form);
      message.success('管理员信息更新成功！');
      dispatch({ type: 'LOAD_USER', admin: payload.data.admin });
    } catch (error) {
      console.log(error);
      if (error.status === 422) {
        setErrors(error.data.errors);
      }
    }
    setLoading(false);
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    logout();
    message.success('注销成功！');
    routeJump('/');
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            {errors && <ListErrors errors={errors} />}
            <form onSubmit={handleSubmit}>
              <fieldset>
                <div className="form-group">
                  <input
                    name="image"
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    value={form.image}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    name="username"
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="username"
                    value={form.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    name="email"
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    name="password"
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="New Password"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={loading}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
