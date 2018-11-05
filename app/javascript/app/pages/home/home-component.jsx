import React, { PureComponent } from 'react';
import styles from './home-styles.scss';

class Home extends PureComponent {
  render() {
    return (
      <div className={styles.page}>
        <h2>Home page</h2>
      </div>
    );
  }
}

export default Home;
