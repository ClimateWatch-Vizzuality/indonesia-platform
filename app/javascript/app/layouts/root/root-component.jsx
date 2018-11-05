import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import { Loading } from 'cw-components';
import universal from 'react-universal-component';

import Header from 'components/header';
import Sticky from 'react-stickynode';
import Footer from 'components/footer';

import headerStyles from 'components/header/header-styles';
import styles from './root-styles.scss';

const universalOptions = {
  loading: <Loading height={500} />,
  minDelay: 400
}
const PageComponent = universal((
  { path } /* webpackChunkName: "[request]" */
) => (import(`../../${path}.js`)), universalOptions);

class App extends PureComponent {
  render() {
    const { route } = this.props;
    return (
      <React.Fragment>
        <Sticky top={-85} className={styles.header} activeClass={headerStyles.stickyWrapper} innerZ={5}>
          <Header />
        </Sticky>
        <div className={styles.appContent}>
          <PageComponent path={route.component} />
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

App.propTypes = {
  route: Proptypes.object.isRequired
};

export default App;
