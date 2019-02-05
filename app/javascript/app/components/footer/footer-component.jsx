import React from 'react';
import { BottomBar, Icon } from 'cw-components';
import resourceWatchLogo from 'assets/resource-watch-logo.svg';
import contactIcon from 'assets/contact.svg';
import cx from 'classnames';
import founders from 'constants/founders';
import styles from './footer-styles.scss';

const rwLogo = (
  <Icon
    alt="Resource Watch Logo"
    icon={resourceWatchLogo}
    theme={{ icon: styles.icon }}
  />
);

const contactLinkIcon = (
  <Icon alt="Contact Link" icon={contactIcon} theme={{ icon: styles.icon }} />
);

const upperFooter = (
  <React.Fragment>
    <div className={styles.line} />
    <div className={styles.grid}>
      <div className={styles.content}>
        <span className={styles.text}>
          Funding for this initiative is provided by
        </span>
        {founders.map(
          partner => partner.img && (
          <div key={partner.img.alt} className={styles.logoContainer}>
            <a
              className={cx(styles.logo, styles[partner.img.customClass])}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className={styles.defaultLogo}
                src={partner.img.src}
                alt={partner.img.alt}
              />
            </a>
            {partner.description && <div>{partner.description}</div>}
          </div>
            )
        )}
      </div>
      <a className={styles.contactUs} href="mailto:climatewatch@wri.org">
        {contactLinkIcon}
        CONTACT US
      </a>
    </div>
  </React.Fragment>
);

const bottomBar = (
  <React.Fragment>
    <BottomBar
      className={styles.content}
      theme={{
        bottomBar: styles.bottomBar,
        bottomBarContainer: styles.bottomBarContainer,
        bottomBarText: styles.bottomBarText
      }}
    >
      <div className={styles.barContent}>
        <a
          className={styles.link}
          href="permissions-and-licensing"
          target="_blank"
          rel="noopener noreferrer"
        >
          Permissions & Licensing
        </a>
        <div className={styles.copyright}>
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
        </div>
      </div>
    </BottomBar>
  </React.Fragment>
);
function Footer() {
  return (
    <footer className={styles.footer}>
      {upperFooter}
      {bottomBar}
    </footer>
  );
}
export default Footer;
