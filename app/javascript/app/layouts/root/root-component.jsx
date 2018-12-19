import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import { Loading } from 'cw-components';
import universal from 'react-universal-component';
import SectionsContentProvider from 'providers/sections-content-provider';
import TranslationsProvider from 'providers/translations-provider';

import Header from 'components/header';
import Sticky from 'react-stickynode';
import Footer from 'components/footer';
import NavNestedMenu from 'components/nav-nested-menu';

import { LANGUAGES_AVAILABLE } from 'constants/languages';
import headerStyles from 'components/header/header-styles';
import styles from './root-styles.scss';

import ReactGA from 'react-ga';

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
    handleTrack(this.props.location);
  }

  componentDidUpdate(prevProps) {
    handleTrack(this.props.location, prevProps.location);
  }

  handleLanguageChange = (language) => {
    const { onChangeLanguage } = this.props;
    onChangeLanguage(language.value);
  };

  render() {
    const { route, locale } = this.props;
    return (
      <React.Fragment>
        <Sticky top={-85} className={styles.header} activeClass={headerStyles.stickyWrapper} innerZ={5}>
          <Header />
        </Sticky>
        <NavNestedMenu
          key='language'
          options={LANGUAGES_AVAILABLE}
          title={LANGUAGES_AVAILABLE.find(lang => lang.value === locale)}
          buttonClassName={styles.link}
          onValueChange={this.handleLanguageChange}
          positionRight
        />
        <div className={styles.appContent}>
          <PageComponent path={route.component} />
        </div>
        <Footer />
        <SectionsContentProvider />
        <TranslationsProvider />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  route: Proptypes.object.isRequired,
  location: Proptypes.object.isRequired,
  locale: Proptypes.string.isRequired,
  onChangeLanguage: Proptypes.func.isRequired
};

export default App;
