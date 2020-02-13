import React from 'react';
import { Link, LinkGetProps, LinkProps } from '@reach/router';
import useAuth from '../context/auth';
import { IAdmin } from '../types';
import { APP_NAME } from '../utils';
import styles from './Header.module.scss'
import { Icon } from 'antd';

export default function Header() {
  const {
    state: { admin },
  } = useAuth();

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          {APP_NAME}
        </Link>
        {admin ? <LoggedInView admin={admin} /> : <LoggedOutView />}
      </div>
    </nav>
  );
}

const LoggedInView = ({ admin: { username, image } }: { admin: IAdmin }) => (
  <ul className="nav navbar-nav pull-xs-right">
    <li className="nav-item">

      <NavLink to="/">
        <Icon type="home" />
        &nbsp;首页
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/modelEditor">
        <Icon type="plus-square" />
        &nbsp;创建模块
      </NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/settings">
        <i className="ion-gear-a" />
        &nbsp;账号设置
      </NavLink>
    </li>

    <li className="nav-item">
      {image && <img src={image} className={`admin-pic ${styles.adminPic}`} alt={username} />}
      {username}
    </li>
  </ul>
);

const LoggedOutView = () => (
  <ul className="nav navbar-nav pull-xs-right">
    <li className="nav-item">
      <NavLink to="/">Home</NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/login">Sign in</NavLink>
    </li>

    <li className="nav-item">
      <NavLink to="/register">Sign up</NavLink>
    </li>
  </ul>
);

const NavLink = (props: LinkProps<{}>) => (
  // @ts-ignore
  <Link getProps={isActive} {...props} />
);

const isActive = ({ isCurrent }: LinkGetProps) => {
  return isCurrent
    ? { className: 'nav-link active' }
    : { className: 'nav-link' };
};
