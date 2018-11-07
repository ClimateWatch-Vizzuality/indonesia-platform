import React from 'react';
import { BottomBar, Icon } from 'cw-components';
import resourceWatchLogo from 'assets/resource-watch-logo.svg';
import styles from './footer-styles.scss';

const rwLogo = (
  <Icon
    alt="Resource Watch Logo"
    icon={resourceWatchLogo}
    theme={{ icon: styles.icon }}
  />
);

function Footer() {
  return (
    <footer className={styles.footer}>
      <BottomBar
        className={styles.content}
        theme={{
          bottomBar: styles.bottomBar,
          bottomBarContainer: styles.bottomBarContainer,
          bottomBarText: styles.bottomBarText
        }}
      >
        Climate Watch © {new Date().getFullYear()} Powered by
        <a
          href="https://resourcewatch.org/"
          alt="Resource Watch Link"
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {rwLogo}
          <span className={styles.resourceWatch}>
            <span className={styles.resource}>
              RESOURCE
            </span>
            WATCH
          </span>
        </a>
      </BottomBar>
    </footer>
  );
}
export default Footer;
