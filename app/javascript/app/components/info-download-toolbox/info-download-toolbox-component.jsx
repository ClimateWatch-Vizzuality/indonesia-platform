import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { ButtonGroup, Button, Icon } from 'cw-components';
import iconInfo from 'assets/icons/info';
import downloadIcon from 'assets/icons/download';
import buttonThemes from 'styles/themes/button';
import ReactTooltip from 'react-tooltip';
import ModalMetadata from 'components/modal-metadata';
import DownloadMenu from 'components/download-menu';
import { handleAnalytics } from 'utils/analytics';
import styles from './info-download-toolbox-styles.scss';

const { API_URL } = process.env;

class InfoDownloadToolbox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { opened: false };
  }

  handleDownloadClick = () => {
    const { downloadUri, locale } = this.props;
    if (downloadUri) {
      handleAnalytics('Data Download', 'Download', downloadUri);
      window.open(`${API_URL}/${downloadUri}.csv?locale=${locale}`, '_blank');
    }
  };

  handleMenuDownloadClick = option => {
    const { locale } = this.props;
    const isPDF = option.value === 'pdf';
    handleAnalytics('Data Download', 'Download', option.url);

    if (isPDF) {
      window.open(option.url, '_blank');
    } else {
      window.open(
        `${API_URL}/${option.url}.${option.value}?locale=${locale}`,
        '_blank'
      );
    }
  };

  handleInfoClick = () => {
    const { slugs, setModalMetadata } = this.props;
    if (slugs) {
      handleAnalytics('Info Window', 'Open', slugs);
      setModalMetadata({ slugs, open: true });
    }
  };

  render() {
    const {
      theme,
      downloadUri,
      className,
      noDownload,
      infoTooltipdata,
      downloadTooltipdata,
      downloadOptions
    } = this.props;

    const { opened } = this.state;

    const renderDownloadButton = () => {
      const isDownloadMenu = downloadOptions && downloadOptions.length > 0;
      return isDownloadMenu ? (
        <React.Fragment>
          <Button
            onClick={() => this.setState({ opened: !opened })}
            theme={{
              button: cx(buttonThemes.outline, styles.button, theme.infobutton)
            }}
          >
            <div
              data-for="blueTooltip"
              data-tip={downloadTooltipdata || 'Download chart in .csv'}
            >
              <div className={styles.iconWrapper}>
                <Icon icon={downloadIcon} />
              </div>
            </div>
          </Button>
          <DownloadMenu
            opened={opened}
            options={downloadOptions}
            handleDownload={this.handleMenuDownloadClick}
          />
        </React.Fragment>
) : (
  <div
    data-for="blueTooltip"
    data-tip={downloadTooltipdata || 'Download chart in .csv'}
  >
    <Button
      onClick={this.handleDownloadClick}
      theme={{
              button: cx(buttonThemes.outline, styles.button, theme.infobutton)
            }}
      disabled={!downloadUri}
    >
      <Icon icon={downloadIcon} />
    </Button>
  </div>
);
    };

    return (
      <ButtonGroup
        theme={{
          wrapper: cx(
            styles.buttonWrapper,
            theme.buttonWrapper,
            className.buttonWrapper
          )
        }}
      >
        <div
          data-for="blueTooltip"
          data-tip={infoTooltipdata || 'Chart information'}
        >
          <Button
            onClick={this.handleInfoClick}
            theme={{
              button: cx(buttonThemes.outline, styles.button, theme.infobutton)
            }}
          >
            <Icon icon={iconInfo} />
          </Button>
        </div>
        <div>
          {!noDownload && renderDownloadButton()}
        </div>
        <ReactTooltip
          id="blueTooltip"
          effect="solid"
          className="global_blueTooltip"
        />
        <ModalMetadata />
      </ButtonGroup>
    );
  }
}

InfoDownloadToolbox.propTypes = {
  theme: PropTypes.shape({
    buttonWrapper: PropTypes.string,
    infobutton: PropTypes.string
  }),
  className: PropTypes.object,
  slugs: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]),
  downloadUri: PropTypes.string,
  infoTooltipdata: PropTypes.string,
  downloadTooltipdata: PropTypes.string,
  setModalMetadata: PropTypes.func.isRequired,
  noDownload: PropTypes.bool,
  downloadOptions: PropTypes.array,
  locale: PropTypes.string.isRequired
};

InfoDownloadToolbox.defaultProps = {
  theme: {},
  className: {},
  slugs: [],
  downloadUri: null,
  infoTooltipdata: null,
  downloadTooltipdata: null,
  downloadOptions: [],
  noDownload: false
};

export default InfoDownloadToolbox;
