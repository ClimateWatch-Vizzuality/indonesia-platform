import { connect } from 'react-redux';
import { getTranslate } from 'selectors/translation-selectors';
import Component from './stories-component';

const stories = [
  {
    date: 'Oct 5, 2018',
    title: 'How can Indonesia achieve its climate change mitigation goal?',
    description: 'An analysis of potential emissions reductions from energy and land-use policies.',
    link: 'todo',
    background_image_url: 'assets/story-1.png'
  },
  {
    date: 'Oct 5, 2018',
    title: 'Got climate questions?',
    description: 'Climate Watch has answers!',
    link: 'todo',
    background_image_url: 'assets/story-2.png'
  },
  {
    date: 'Oct 5, 2018',
    title: 'Stepping into the future',
    description: 'Creating long-term strategies for low GHG emissions and development.',
    link: 'todo',
    background_image_url: 'assets/story-3.png'
  }
];

const mapStateToProps = state => ({ t: getTranslate(state), stories });

export default connect(mapStateToProps, null)(Component);
