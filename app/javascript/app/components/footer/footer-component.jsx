import React from 'react';
import { BottomBar } from 'cw-components';

import styles from './footer-styles.scss';

function Footer() {
  return (
    <footer className={styles.footer}>
      <BottomBar
        footerText={
          `Powered by <span style="text-transform: uppercase"><b>Climate</b>Watch</span>`
        }
        className={styles.content}
        theme={{
          bottomBar: styles.bottomBar,
          bottomBarContainer: styles.bottomBarContainer,
          bottomBarText: styles.bottomBarText
        }}
      />
    </footer>
  );
}

export default Footer;
