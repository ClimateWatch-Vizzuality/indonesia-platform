import { connect } from 'react-redux';
import { getTranslate, getLocale } from 'selectors/translation-selectors';
import Component from './stories-component';

const localizedStories = (state, stories) => {
  const locale = getLocale(state);
  return stories[locale];
};

const stories = {
  en: [
    {
      date: 'Oct 5, 2017',
      title: 'How can Indonesia achieve its climate change mitigation goal?',
      description: 'An analysis of potential emissions reductions from energy and land-use policies.',
      link: 'http://wri-indonesia.org/en/publication/how-can-indonesia-achieve-its-climate-change-mitigation-goal',
      background_image_url: 'assets/story-1.png'
    },
    {
      date: 'Nov 26, 2018',
      title: '12 Years to Exceed 1.5 Degree',
      description: 'Programs must be designed to reduce emissions effectively while achieving optimal economic growth.',
      link: 'http://wri-indonesia.org/en/blog/12-years-exceed-15-degree',
      background_image_url: 'assets/story-2.jpg'
    },
    {
      date: 'Dec 11, 2018',
      title: 'Taking Stock of Indonesia’s Progress',
      description: ' Indonesia has committed to reduce its greenhouse gas emissions by 29 percent against a business as usual scenario by 2030.',
      link: 'http://wri-indonesia.org/en/blog/taking-stock-indonesia%E2%80%99s-progress',
      background_image_url: 'assets/story-3.jpg'
    }
  ],
  id: [
    {
      date: 'Oct 5, 2017',
      title: 'Bagaimana Indonesia Dapat Mencapai Target Mitigasi Perubahan Iklim?',
      description: 'Analisis Potensi Penurunan Emisi dari Kebijakan Energi dan Tata Guna Lahan.',
      link: 'http://wri-indonesia.org/id/publication/bagaimana-indonesia-dapat-mencapai-target-mitigasi-perubahan-iklim',
      background_image_url: 'assets/story-1.png'
    },
    {
      date: 'Nov 26, 2018',
      title: 'Dua Belas Tahun untuk Lampaui 1,5 Derajat',
      description: '',
      link: 'http://wri-indonesia.org/id/blog/dua-belas-tahun-untuk-lampaui-15-derajat',
      background_image_url: 'assets/story-2.jpg'
    },
    {
      date: 'Dec 11, 2018',
      title: 'Meninjau Kemajuan Aksi Iklim Indonesia',
      description: '',
      link: 'http://wri-indonesia.org/id/blog/meninjau-kemajuan-aksi-iklim-indonesia',
      background_image_url: 'assets/story-3.jpg'
    }
  ]
};

const mapStateToProps = state => ({
  t: getTranslate(state),
  stories: localizedStories(state, stories)
});
export default connect(mapStateToProps, null)(Component);
