import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import useStores from '../../stores/UseStores';

import CallApi from '../../utils/callApi';
import { setCookie, getCookie } from '../../utils/cookie';
import costComma from '../../helpers/costComma';
import signPositiveNumber from '../../helpers/signPositiveNumber';
import { coinNameKR } from '../../constants/NameParser';
import { bannerList, BannerList } from '../../constants/BannerList';

import Input from '../../atoms/Input';
import Nav from '../../components/Nav';
import Tab from '../../components/Tab';
import Table from '../../components/Table';
import Slider from '../../components/Slider/Slider';

import styles from './Home.module.scss';

const Home = (props: any) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [currencyList, setCurrencyList] = useState<any>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>();
  const [favorites, setFavorites] = useState<any[]>([]);

  const store = useStores();
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    setTimeout(() => {
      getTicker();
    }, 1000);
  }, [currencyList]);

  const getTicker = async () => {
    try {
      const orderCurrency = 'ALL';
      const paymentCurrency = 'KRW';

      const data = {
        method: 'GET',
        url: `https://api.bithumb.com/public/ticker/${orderCurrency}_${paymentCurrency}`,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        // if (searchValue) {
        //   const filter = Object.keys(responseJson.data);
        // }
        setCurrencyList(responseJson.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const moveTab = (tab: string) => {
    router.push({ query: { tab } }, undefined, { shallow: true });
  };

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  const getDayToDayFluctate = (name: string, type: string) => {
    const yesterdayPrice = Number(currencyList[name]?.prev_closing_price);
    const currentPrice = Number(currencyList[name]?.closing_price);
    const fluctatePrice = Math.round((currentPrice - yesterdayPrice) * 100) / 100;
    const fluctateRate = Math.round((fluctatePrice / yesterdayPrice) * 10000) / 100;
    if (type === 'krw') {
      return fluctatePrice;
    }
    if (type === 'rate') {
      return fluctateRate;
    }
  };

  const moveToExchange = (selectedCurrency: string) => {
    router.push({ pathname: '/exchange', query: { selectedCurrency, tab: 'krw' } }, undefined, { shallow: true });
  };

  const moveToRanking = () => {
    router.push({ pathname: '/ranking' }, undefined, { shallow: true });
  };

  const onAddFavorites = (name: string, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    const favorites = getCookie('favoriteCoins') || [];
    if (favorites.length !== 0) {
      if (favorites?.includes(name)) {
        const filteredFavorites = favorites.filter((item: string) => item !== name);

        setCookie('favoriteCoins', [...filteredFavorites], {
          path: '/',
          secure: true,
          sameSite: 'none',
        });
      } else {
        setCookie('favoriteCoins', [...favorites, name], {
          path: '/',
          secure: true,
          sameSite: 'none',
        });
      }
    } else {
      setCookie('favoriteCoins', [name], {
        path: '/',
        secure: true,
        sameSite: 'none',
      });
    }
  };

  const renderHeaderChart = () => {
    return (
      <header className={styles.header_wrap}>
        <div className={styles.banner_wrap}>
          {/* {bannerList.map((item: BannerList, i: number) => {
            return (
              <div key={i} className={styles.banner_box} onClick={() => window.open(item.url, '_blank')}>
                <Image src={item.src} alt="BannerImage" width={278} height={144} />
              </div>
            );
          })} */}
          <Slider />
        </div>
        {/* <div className={styles.introduce_wrap}> */}
        <div className={styles.hs_introduce_wrap}>
          {/* <div className={styles.introduce_title}>암호화폐 모의투자</div> */}
          <div style={{ padding: 40 }}>
            <div>
              <h2>암호화폐 모의투자</h2>
            </div>
            <div className={styles.introduce_description} style={{ color: '#979797' }}>
              BITMOI에서 실전처럼 암호화폐 투자를 체험해보세요! <br />
              참가자들의 수익률 현황은 랭킹에서 확인하실 수 있습니다!
            </div>
            <div className={styles.introduce_button_wrap}>
              <div className={styles.button_wrap} onClick={() => moveToExchange('BTC')}>
                모의투자
              </div>
              <div className={styles.button_wrap} onClick={() => moveToRanking()}>
                랭킹
              </div>
            </div>
          </div>

          <div
            className="bg-img"
            style={{
              width: 500,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
              backgroundImage: `url("https://images.unsplash.com/photo-1604594849809-dfedbc827105?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80")`,
            }}></div>
        </div>
        {/* </div>
        <div className={styles.introduce_wrap}>
          <div className={styles.introduce_title}>암호화폐 모의투자</div>
          <div className={styles.introduce_description}>
            BITMOI에서 실전처럼 암호화폐 투자를 체험해보세요! <br />
            참가자들의 수익률 현황은 랭킹에서 확인하실 수 있습니다!
          </div>
          <div className={styles.introduce_button_wrap}>
            <div className={styles.button_wrap} onClick={() => moveToExchange('BTC')}>
              모의투자
            </div>
            <div className={styles.button_wrap} onClick={() => moveToRanking()}>
              랭킹
            </div>
          </div>
        </div> */}
      </header>
    );
  };

  const tbodyData = () => {
    let keys = Object.keys(currencyList);
    const favoriteCoins = getCookie('favoriteCoins') || [];
    if (query.tab === 'favorites') {
      keys = favoriteCoins;
    }

    if (searchValue) {
      keys = keys.filter(
        (v: string) => v.includes(searchValue.toUpperCase()) || coinNameKR[v]?.includes(searchValue.toUpperCase())
      );
    }
    if (Math.ceil(keys.length / 30) !== totalPage) {
      setTotalPage(Math.ceil(keys.length / 30));
    }
    return keys.map((name: string, i: number) => {
      const currentPrice = currencyList[name]?.closing_price;
      const accTradeValue = currencyList[name]?.acc_trade_value_24H;
      const dayToDayFluctate = getDayToDayFluctate(name, 'krw');
      const dayToDayFluctateRate = getDayToDayFluctate(name, 'rate');
      const nameKR: string = coinNameKR[name];
      if (name === 'date') {
        return;
      }
      return (
        <tr key={i} className={styles.table_row} onClick={() => moveToExchange(name)}>
          <td className={styles.table_favorites} onClick={(e: any) => onAddFavorites(name, e)}>
            {favoriteCoins?.includes(name) ? (
              <Image src="/images/star.png" alt="Favorite Image" width={14} height={14} />
            ) : (
              <Image src="/images/star_empty.png" alt="Favorite Empty Image" width={14} height={14} />
            )}
          </td>
          <td className={styles.table_asset_column}>
            <div style={{ fontSize: '15px' }}>{nameKR}</div>
            <div style={{ fontSize: '12px', color: '#a4a4a4' }}>{`${name} / KRW`}</div>
          </td>
          <td className={styles.table_current_price}>
            {`${currentPrice < 1 ? currentPrice : costComma(currentPrice)} 원`}
          </td>
          <td
            className={styles.table_fluctate}
            style={
              Math.sign(Number(dayToDayFluctateRate)) === 1
                ? { color: '#F75467' }
                : Math.sign(Number(dayToDayFluctateRate)) === 0
                ? { color: '#282828' }
                : { color: '#4386F9' }
            }>
            <span>{`${signPositiveNumber.signPricePositive(Number(dayToDayFluctate))} 원 `}</span>
            <span>{`(${signPositiveNumber.signRatePositive(Number(dayToDayFluctateRate))} %)`}</span>
          </td>
          <td className={styles.table_accumulate_trade}>{`${costComma(Math.round(Number(accTradeValue)))} 원`}</td>
          <td className={styles.table_exchange_wrap} onClick={() => moveToExchange(name)}>
            <div className={styles.table_exchange}>{'거래하기'}</div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className={styles.container}>
      {renderHeaderChart()}
      <div className={styles.contents_wrap}>
        <div className={styles.table_header_wrap}>
          <Tab
            tabs={{
              tabItems: [
                {
                  key: 'krw',
                  label: '원화 마켓',
                  onClick: () => moveTab('krw'),
                },
                {
                  key: 'favorites',
                  label: '즐겨 찾기',
                  onClick: () => moveTab('favorites'),
                },
              ],
              selectedTab: query.tab,
            }}
            contentsStyle={{ width: '260px', fontSize: '20px' }}
          />
          <Input
            image={true}
            type="text"
            placeholder="검색"
            className={styles.input_style}
            maxLength={12}
            handleChange={(value: string) => handleChange(value)}
            propValue={searchValue}
            clearButton="on"
          />
        </div>
        <Table
          theadWidth={[200, 300, 300, 250, 150]}
          theadTextAlign={['left', 'right', 'right', 'right', 'center']}
          theadPadding={['0 0 0 40px', '0 13px', '0 24px 0 13px', '0 13px', '0 23px 0 23px']}
          theadData={['자산', '실시간 시세', '변동률 (전일대비)', '거래금액(24H)', '차트 / 거래']}
          tbodyData={tbodyData()}
          tbodyStyle={{ fontSize: '14px', fontWeight: 400 }}
          emptyTable={{
            text: '검색된 가상자산이 없습니다',
            style: { fontSize: '13px', textAlign: 'center', padding: '20px' },
          }}
          tableStyle={{
            width: '1200px',
            maxHeight: '1073px',
            justifyItems: 'center',
          }}
        />
      </div>
      <footer className={styles.footer}>{'footer'}</footer>
    </div>
  );
};

export default Home;
