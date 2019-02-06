import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import { Loading } from 'cw-components';
import ReactGA from 'react-ga';
import universal from 'react-universal-component';
import TranslationsProvider from 'providers/translations-provider';
import ProvincesProvider from 'providers/provinces-provider';

import Header from 'components/header';
import Footer from 'components/footer';

import styles from './root-styles.scss';

const { GOOGLE_ANALYTICS_ID } = process.env;

function trackPage(page) {
  ReactGA.set({ page });
  ReactGA.pageview(page);
}

let gaInitialized = false;
const initializeGa = () => {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID);
  gaInitialized = true;
}

function handleTrack(location, prevLocation) {
  if (GOOGLE_ANALYTICS_ID) {
    if (!gaInitialized) { initializeGa(); }

    const page = location.pathname;
    const prevPage = prevLocation && prevLocation.pathname;

    const pageChanged = prevPage && page !== prevPage;
    if(!prevLocation || pageChanged) { trackPage(page); }

  }
}

const universalOptions = {
  loading: <Loading height={500} />,
  minDelay: 400
}
const PageComponent = universal((
  { path } /* webpackChunkName: "[request]" */
) => (import(`../../${path}.js`)), universalOptions);

class App extends PureComponent {
  componentDidMount() {
    const { location } = this.props;
    handleTrack(location);
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    handleTrack(location, prevProps.location);
  }

  render() {
    const { route } = this.props;
    return (
      <React.Fragment>
        <Header />
        <div className={styles.appContent}>
          <PageComponent path={route.component} />
        </div>
        <Footer />
        <TranslationsProvider />
        <ProvincesProvider />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  route: Proptypes.object.isRequired,
  location: Proptypes.object.isRequired
};

export default App;
