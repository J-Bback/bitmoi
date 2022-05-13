export const bannerList: Array<BannerList> = [
  {
    url: 'https://www.bithumb.com/',
    backgroundImage: 'https://www.serebii.net/pokemongo/pokemon/001.png',
    src: '/images/bithumb.png',
  },
  {
    url: 'https://www.bithumb.com/',
    backgroundImage: 'https://www.serebii.net/pokemongo/pokemon/002.png',
    src: '/images/bithumb2.png',
  },
  {
    url: 'https://www.codestates.com/',
    backgroundImage: 'https://www.serebii.net/pokemongo/pokemon/003.png',
    src: '/images/codestates.png',
  },
  {
    url: 'https://www.codestates.com/',
    backgroundImage: 'https://www.serebii.net/pokemongo/pokemon/003.png',
    src: '/images/codestates2.png',
  },
];

export type BannerList = {
  url: string;
  backgroundImage: string;
  src: string;
};
