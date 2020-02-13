import React from 'react';
import Banner from './Banner';
import MainView from './MainView';
import { RouteComponentProps } from '@reach/router';
import { ModelsProvider } from '../../context/models';

export default function Home(_: RouteComponentProps) {
  return (
    <div className="home-page">
      <Banner />
      <div className="container page">
        <div className="row">
          <ModelsProvider>
            <MainView />
          </ModelsProvider>
        </div>
      </div>
    </div>
  );
}
