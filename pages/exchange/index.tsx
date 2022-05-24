import React, { useState, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Image from 'next/image';
import CallApi from '../../utils/callApi';
import costComma from '../../helpers/costComma';
import signPositiveNumber from '../../helpers/signPositiveNumber';
import { coinNameKR } from '../../constants/NameParser';
import { setCookie, getCookie } from '../../utils/cookie';
import { ApexChart } from '../../components/ApexChart';
import Input from '../../atoms/Input';
import Button from '../../atoms/Button';
import Tab from '../../components/Tab';
import Table from '../../components/Table';
import { useInterval } from '../../hooks/UseInterval';
import initializeStore from '../../stores';

import styles from './Exchange.module.scss';

interface Size {
  width: number | undefined;
  height: number | undefined;
}

interface BarData {
  x: number;
  y: number;
  fillColor: string;
  strokeColor?: string;
}

interface CandleData {
  x: number;
  y: string[];
}

type BidAndAsk = {
  quantity: string;
  price: string;
};
type OrderBook = {
  timestamp: number;
  order_currency: string;
  payment_currency: string;
  bids: Array<BidAndAsk>;
  asks: Array<BidAndAsk>;
};

type OrderBookHistory = {
  coinid: number;
  createdat: number[];
  orderbookid: number;
  price: number;
  quantity: number;
  state: string;
  types: string;
  updatedat: number[];
  userid: number;
};

type Transaction = {
  execute_id: null | number;
  order_id: number;
  user_id: number;
  coin_id: number;
  price: number;
  quantity: number;
  types: string;
  created_at: string | Date;
  updated_at: null | Date | string;
};

const coinList = [
  { label: '비트코인', symbol: 'BTC', id: 1 },
  { label: '이더리움', symbol: 'ETH', id: 2 },
  { label: '라이트코인', symbol: 'LTC', id: 3 },
  { label: '이더리움클래식', symbol: 'ETC', id: 4 },
  { label: '리플', symbol: 'XRP', id: 5 },
  { label: '비트코인캐시', symbol: 'BCH', id: 6 },
  { label: '퀀텀', symbol: 'QTUM', id: 7 },
  { label: '비트코인골드', symbol: 'BTG', id: 8 },
  { label: '이오스', symbol: 'EOS', id: 9 },
  { label: '아이콘', symbol: 'ICX', id: 10 },
  { label: '트론', symbol: 'TRX', id: 11 },
];

const Exchange = (props: any) => {
  const [series, setSeries] = useState<any>([]);
  const [barSeries, setBarSeries] = useState<Array<BarData>>([]);
  const [currencyList, setCurrencyList] = useState<any>({});
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BTC');
  const [chartList, setChartList] = useState<any>(['1분', '10분', '1시간', '6시간']);
  const [chartSelect, setChartSelect] = useState<string>('1시간');
  const [orderbook, setOrderbook] = useState<OrderBook>();
  const [orderType, setOrderType] = useState<string>('pending');
  const [bidOrAsk, setBidOrAsk] = useState<string>('매수');
  const [orderPrice, setOrderPrice] = useState<number>();
  const [orderTotalPrice, setOrderTotalPrice] = useState<string>('0');
  const [orderCount, setOrderCount] = useState<number>();
  const [orderbookHistory, setOrderbookHistory] = useState<Array<OrderBookHistory>>([]);
  const [transactionHistory, setTransactionHistory] = useState<Array<Transaction>>([]);

  const store = initializeStore();
  const router = useRouter();
  const { authStore } = store;
  const { query } = router;

  useInterval(() => {
    getData();
  }, 2000);
  useInterval(() => {
    getTicker();
  }, 2000);
  useInterval(() => {
    getOrderBook();
  }, 2000);

  useEffect(() => {
    getData();
    getTicker();
    getOrderBook();
  }, []);

  useEffect(() => {
    async function fetchAndSetOrderPrice() {
      const data = currencyList;
      const coinPrice = Number(data[selectedCurrency]?.closing_price);
      setOrderPrice(coinPrice);
      setOrderCount(0);
      setOrderTotalPrice('0');
    }
    fetchAndSetOrderPrice();
  }, [selectedCurrency]);

  useEffect(() => {
    if (query?.selectedCurrency) {
      const selectedCoin: string = String(query?.selectedCurrency);
      getOrderBook(selectedCoin);
      setSelectedCurrency(selectedCoin);
    } else {
      getOrderBook(selectedCurrency);
    }
  }, []);

  useEffect(() => {
    if (authStore?.logged === true) {
      getOrderBookHistory();
      getTransactionHistory(authStore?.userId);
    }
  }, []);

  useEffect(() => {
    if (orderType === 'market') {
      setOrderPrice(currencyList[selectedCurrency].closing_price);
    }
  }, [orderType]);

  const intervalParser = (time: string) => {
    switch (time) {
      case '1분':
        return '1m';
      case '10분':
        return '10m';
      case '1시간':
        return '1h';
      case '6시간':
        return '6h';
      default:
        break;
    }
  };

  const getData = async () => {
    try {
      const orderCurrency = selectedCurrency;
      const paymentCurrency = 'KRW';
      const chartIntervals = intervalParser(chartSelect);
      const data = {
        method: 'GET',
        url: `https://bitmoi-proxy.herokuapp.com/https://api.bithumb.com/public/candlestick/${orderCurrency}_${paymentCurrency}/${chartIntervals}`,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        const cloneData = cloneDeep(responseJson.data);
        const seriesData: Array<CandleData> = [];
        const barSeriesData: Array<BarData> = [];
        const len: number = responseJson.data.length;
        const fiftyData: any = cloneData.splice(-50, 50);
        fiftyData.map((v: any) => seriesData.push({ x: v[0], y: [v[1], v[3], v[4], v[2]] }));
        fiftyData.map((v: any) =>
          barSeriesData.push({
            x: v[0],
            y: Math.abs(v[1] - v[2]),
            fillColor: v[1] - v[2] > 0 ? '#1F5ED2' : '#D13C4B',
          })
        );
        setSeries(seriesData);
        setBarSeries(barSeriesData);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getTicker = async () => {
    try {
      const orderCurrency = 'ALL';
      const paymentCurrency = 'KRW';
      const data = {
        method: 'GET',
        url: `https://bitmoi-proxy.herokuapp.com/https://api.bithumb.com/public/ticker/${orderCurrency}_${paymentCurrency}`,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        setCurrencyList(responseJson.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getOrderBook = async (selectedCoin?: string) => {
    try {
      const orderCurrency = selectedCoin ?? selectedCurrency;
      const paymentCurrency = 'KRW';
      const data = {
        method: 'GET',
        url: `https://bitmoi-proxy.herokuapp.com/https://api.bithumb.com/public/orderbook/${orderCurrency}_${paymentCurrency}`,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        setOrderbook(responseJson.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const orderBidOrAsk = async () => {
    const targetCoin = coinList.find((item) => item.symbol === selectedCurrency);
    const coinId = targetCoin?.id || 1;
    // const orderState = orderType === 'market' ? 'execute' : 'wait';
    try {
      const type = bidOrAsk === '매수' ? 'bid' : 'ask';
      const url = 'http://52.78.124.218:9000/orders';
      const data = {
        method: 'POST',
        url: url,
        body: {
          coinid: coinId, // selectedCoin : ex) 'BTC' 심볼과 id를 맞춰야한다.
          quantity: orderCount,
          price: orderPrice,
          types: type,
          state: 'wait',
        },
      };
      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        console.log('bid', bidOrAsk);
        if (orderType === 'market') {
          alert('주문 접수가 완료되었습니다.');
        }
        alert(`${bidOrAsk} 주문이 완료되었습니다.`);
        return getOrderBookHistory();
      } else if (response.status === 400) {
        return alert('로그인이 필요합니다.');
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelOrder = async (orderbookId: number) => {
    try {
      const url = `http://52.78.124.218:9000/order/cancel/${orderbookId}`;
      const data = {
        method: 'GET',
        url: url,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        return getOrderBookHistory();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderBookHistory = async () => {
    try {
      const url = 'http://52.78.124.218:9000/orderbook/user';
      const data = {
        method: 'GET',
        url: url,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        setOrderbookHistory(responseJson);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getTransactionHistory = async (userId: number) => {
    try {
      const url = `http://52.78.124.218:9000/executions/${userId}`;
      const data = {
        method: 'GET',
        url: url,
      };

      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response.status === 200) {
        console.log('transaction responseJson', responseJson);
        setTransactionHistory(responseJson);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentPrice = () => {
    return costComma(currencyList[selectedCurrency]?.closing_price);
  };

  const getCurrentFluctateRate = () => {
    return costComma(currencyList[selectedCurrency]?.fluctate_rate_24H);
  };

  const handleChange = (value: string) => {
    setSearchValue(value);
  };

  const moveTab = (tab: string) => {
    router.push({ query: { tab } }, undefined, { shallow: true });
  };

  const onAddFavorites = (name: string, e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    // const favorites = getCookie('favoriteCoins') || [];
    let favorites: any = localStorage.getItem('favoriteCoins');
    if (favorites !== undefined && favorites !== null) {
      favorites = JSON.parse(favorites);
    } else favorites = [];

    if (favorites.length !== 0) {
      if (favorites?.includes(name)) {
        const filteredFavorites = favorites.filter((item: string) => item !== name);

        // setCookie('favoriteCoins', [...filteredFavorites], {
        //   path: '/',
        //   secure: true,
        //   sameSite: 'none',
        // });
        localStorage.setItem('favoriteCoins', JSON.stringify([...filteredFavorites]));
      } else {
        // setCookie('favoriteCoins', [...favorites, name], {
        //   path: '/',
        //   secure: true,
        //   sameSite: 'none',
        // });
        localStorage.setItem('favoriteCoins', JSON.stringify([...favorites, name]));
      }
    } else {
      // setCookie('favoriteCoins', [name], {
      //   path: '/',
      //   secure: true,
      //   sameSite: 'none',
      // });
      localStorage.setItem('favoriteCoins', JSON.stringify([name]));
    }
  };

  const tbodyData = () => {
    let keys = Object.keys(currencyList);
    // const favoriteCoins = getCookie('favoriteCoins') || [];
    if (typeof window !== 'undefined') {
      let favoriteCoins: any = localStorage.getItem('favoriteCoins');
      if (favoriteCoins !== undefined) {
        favoriteCoins = JSON.parse(favoriteCoins);
      } else {
        favoriteCoins = [];
      }

      if (query.tab === 'favorites') {
        keys = favoriteCoins;
      }

      if (searchValue) {
        keys = keys.filter(
          (v: string) => v.includes(searchValue.toUpperCase()) || coinNameKR[v]?.includes(searchValue.toUpperCase())
        );
      }

      return keys?.map((name, i) => {
        const currentPrice = currencyList[name]?.closing_price;
        const fluctate = currencyList[name]?.fluctate_24H;
        const fluctateRate = currencyList[name]?.fluctate_rate_24H;
        const accTradeValue = currencyList[name]?.acc_trade_value_24H;
        const nameKR: string = coinNameKR[name];
        if (name === 'date') {
          return;
        }

        return (
          <tr
            key={i}
            style={{
              cursor: 'pointer',
              textAlign: 'right',
              height: '48px',
              wordBreak: 'break-all',
              alignItems: 'center',
              borderLeft: name === selectedCurrency ? '2px solid #979797' : '',
            }}
            onClick={() => {
              name !== selectedCurrency && setSelectedCurrency(name);
            }}>
            <td style={{ width: '25px' }} onClick={(e) => onAddFavorites(name, e)}>
              {favoriteCoins?.includes(name) ? (
                <Image src="/images/star.png" alt="Favorite Image" width={14} height={14} />
              ) : (
                <Image src="/images/star_empty.png" alt="Favorite Empty Image" width={14} height={14} />
              )}
            </td>
            <td style={{ width: '76px', textAlign: 'left' }}>
              <div>{nameKR}</div>
              <div>{`${name} / KRW`}</div>
            </td>
            <td style={{ width: '74px' }}>{costComma(currentPrice)}</td>
            <td
              style={
                Math.sign(Number(fluctateRate)) === 1
                  ? { color: '#F75467', width: '71px' }
                  : Math.sign(Number(fluctateRate)) === 0
                  ? { color: '#282828', width: '71px' }
                  : { color: '#4386F9', width: '71px' }
              }>
              <span>{`${signPositiveNumber.signRatePositive(Number(fluctateRate))} %`}</span>
              <br />
              <span>{signPositiveNumber.signPricePositive(Number(fluctate))}</span>
            </td>
            <td style={{ width: '92px', paddingRight: '14px' }}>{`${costComma(
              Math.round(Number(accTradeValue) / 1000000)
            )} 백만`}</td>
          </tr>
        );
      });
    }
  };

  const renderTitle = () => {
    const nameKR: string = coinNameKR[selectedCurrency];
    return (
      <div className={styles.title_wrap}>
        <div className={styles.title}>{nameKR}</div>
        <div style={{ color: '#979797', marginBottom: 4 }}>{selectedCurrency} / KRW</div>
      </div>
    );
  };

  const renderChartHeader = () => {
    return (
      <div className={styles.header_bar_wrap}>
        <div className={styles.property}>{'자산'}</div>
        <div>
          <span className={styles.property}>
            {`${selectedCurrency}`} <span>사용가능</span> <span className={styles.color_b}>0.00000000</span> /{' '}
            <span>사용중</span> <span className={styles.color_b}>0.00000000 </span>
          </span>
          <span className={styles.address_link_style}>{` ${selectedCurrency} 입금`}</span>
        </div>
        <div>
          <span className={styles.property}>
            {`${selectedCurrency}`} <span>사용가능</span> <span className={styles.color_b}>0.00000000</span> /{' '}
            <span>사용중</span> <span className={styles.color_b}>0.00000000 </span>
          </span>
          <span className={styles.address_link_style}>{`KRW 입금`}</span>
        </div>
      </div>
    );
  };

  const tableOrderAskBody = () => {
    const askArray = orderbook?.asks.sort((a, b) => {
      if (a.price < b.price) return 1;
      if (a.price > b.price) return -1;
      return 0;
    });

    return askArray?.map((item: BidAndAsk, i: number) => {
      return (
        <tr
          key={i}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            height: '24px',
            wordBreak: 'break-all',
            alignItems: 'center',
            backgroundColor: '#F5FAFF',
          }}
          onClick={() => {
            setOrderPrice(Number(item.price));
            setOrderCount(Number(item.quantity));
          }}>
          <td style={{ color: '#1F5ED2' }}>{`${Number(item?.price)?.toLocaleString()} KRW`}</td>
          <td>{item.quantity}</td>
        </tr>
      );
    });
  };

  const tableOrderBidBody = () => {
    const bidArray = orderbook?.bids;

    return bidArray?.map((item: BidAndAsk, i: number) => {
      return (
        <tr
          key={i}
          style={{
            cursor: 'pointer',
            textAlign: 'center',
            height: '30px',
            wordBreak: 'break-all',
            alignItems: 'center',
            backgroundColor: '#FFF4F8',
          }}
          onClick={() => {
            setOrderPrice(Number(item.price));
            setOrderPrice(Number(item.quantity));
          }}>
          <td style={{ color: '#D13C4B' }}>{`${Number(item?.price)?.toLocaleString()} KRW`}</td>
          <td>{item.quantity}</td>
        </tr>
      );
    });
  };
  const orderTbodyData = () => {
    return orderbookHistory?.map((item: OrderBookHistory, i: number) => {
      return (
        <tr
          key={i}
          style={{
            textAlign: 'center',
            display: 'flex',
            height: '30px',
            alignItems: 'center',
            backgroundColor: bidOrAsk === '매수' ? '#FFF4F8' : '#F5FAFF',
          }}>
          <td style={{ width: 150 }}>{coinList[item?.coinid].label}</td>
          <td
            style={{
              color: item?.types === 'bid' ? '#D13C4B' : item?.types === 'ask' ? '#1F5ED2' : '#000000',
              width: 60,
            }}>
            {item?.types === 'bid' ? '매수' : item?.types === 'ask' ? '매도' : '거절'}
          </td>
          <td style={{ width: 70 }}>{item?.state === 'wait' ? '대기' : item?.state === 'cancel' ? '취소' : '체결'}</td>
          <td style={{ width: 135 }}>{`${item?.quantity?.toLocaleString() || 0}`}</td>
          <td style={{ width: 135 }}>{`${item?.price?.toLocaleString() || 0} KRW`}</td>
          <td style={{ width: 135 }}>{`${((item?.quantity || 0) * (item.price ?? 0))?.toLocaleString() || 0} KRW`}</td>
          <td style={{ width: 135 }}>
            {dayjs(
              `${item.createdat[0]}-${item.createdat[1]}-${item.createdat[2]} ${item.createdat[3]}:${item.createdat[4]}`
            ).format('YYYY-MM-DD HH:mm')}
          </td>
          <td
            style={{ width: 80, cursor: 'pointer', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
            onClick={() => cancelOrder(item.orderbookid)}>
            <div className={styles.cancel_button}>{'주문취소'}</div>
          </td>
        </tr>
      );
    });
  };

  const transactionTbodyData = () => {
    const data = transactionHistory;
    const targetCoin = coinList.find((item) => item.symbol === selectedCurrency);
    const coinId = targetCoin?.id || 0;

    return data?.map((item: Transaction, i: number) => {
      return (
        <tr
          key={i}
          style={{
            textAlign: 'center',
            display: 'flex',
            height: '30px',
            alignItems: 'center',
            backgroundColor: bidOrAsk === '매수' ? '#FFF4F8' : '#F5FAFF',
          }}>
          <td style={{ width: 150 }}>{coinList[item?.coin_id]?.label || '비트코인'}</td>
          <td
            style={{
              color: item?.types === 'bid' ? '#D13C4B' : item?.types === 'ask' ? '#1F5ED2' : '#000000',
              width: 60,
            }}>
            {item?.types === 'bid' ? '매수' : item?.types === 'ask' ? '매도' : '거절'}
          </td>
          <td style={{ width: 135 }}>{`${item?.quantity?.toLocaleString() || 0}`}</td>
          <td style={{ width: 135 }}>{`${item?.price?.toLocaleString() || 0} KRW`}</td>
          <td style={{ width: 135 }}>{`${(item?.quantity * (item.price ?? 0))?.toLocaleString()} KRW`}</td>
          <td style={{ width: 135 }}>{dayjs(item?.created_at).format('YYYY-MM-DD HH:mm')}</td>
          <td style={{ width: 80, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <div className={styles.cancel_button}>{item?.types === 'cancel' ? '취소' : '체결'}</div>
          </td>
        </tr>
      );
    });
  };

  return (
    <main className={styles.exchange_wrap}>
      <div className={styles.container}>
        <section className={styles.side_bar_wrap}>
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
          <Tab
            tabs={{
              tabItems: [
                {
                  key: 'krw',
                  label: '원화마켓',
                  onClick: () => moveTab('krw'),
                },
                {
                  key: 'favorites',
                  label: '즐겨찾기',
                  onClick: () => moveTab('favorites'),
                },
              ],
              selectedTab: query.tab,
            }}
            contentsStyle={{
              width: '340px',
              borderLeft: '1px solid #eeeeee',
              borderRight: '1px solid #eeeeee',
            }}
          />
          {query.tab === 'krw' && (
            <Table
              theadWidth={[101, 74, 71, 92]}
              theadTextAlign={['left', 'right', 'right', 'right']}
              theadPadding={['0 0 0 25px', '0', '0', '0 14px 0 0']}
              theadData={['자산', '현재가', '변동률(당일)', '거래금액(24H)']}
              tbodyData={tbodyData()}
              emptyTable={{
                text: '검색된 가상자산이 없습니다',
                style: {
                  fontSize: '13px',
                  textAlign: 'center',
                  paddingTop: '20px',
                },
              }}
              tableStyle={{
                width: '100%',
                maxHeight: '1073px',
                fontSize: '12px',
                color: '#232323',
              }}
              tbodyStyle={{ height: '1500px', overflowY: 'auto' }}
            />
          )}
          {query.tab === 'favorites' && (
            <Table
              theadWidth={[101, 74, 71, 92]}
              theadTextAlign={['left', 'right', 'right', 'right']}
              theadPadding={['0 0 0 25px', '0', '0', '0 14px 0 0']}
              theadData={['자산', '현재가', '변동률(당일)', '거래금액(24H)']}
              tbodyData={tbodyData()}
              emptyTable={{
                text: '검색된 가상자산이 없습니다',
                style: {
                  fontSize: '13px',
                  textAlign: 'center',
                  height: '50px',
                  padding: '20px',
                },
              }}
              tableStyle={{
                width: '100%',
                maxHeight: '1073px',
                fontSize: '12px',
                color: '#232323',
              }}
              tbodyStyle={{ height: '975px', overflowY: 'auto' }}
            />
          )}
        </section>
        <section className={styles.ticker_wrap}>
          {renderTitle()}
          {renderChartHeader()}

          <div className={styles.chart_select_bar}>
            {chartList.map((el: string, i: number) => (
              <div
                key={i}
                onClick={() => setChartSelect(el)}
                className={el === chartSelect ? styles.chart_selected : styles.chart_unselected}>
                {el}
              </div>
            ))}
          </div>
          <ApexChart series={series} barSeries={barSeries} />
          <div className={styles.transaction_and_order_wrap}>
            <section style={{ flex: 2 }}>
              <div>
                <Table
                  theadWidth={[120, 120]}
                  theadTextAlign={['center', 'center']}
                  theadData={['매도 (KRW)', `수량 (${selectedCurrency})`]}
                  tbodyData={tableOrderAskBody()}
                  emptyTable={{
                    text: '주문내역이 없습니다.',
                    style: {
                      fontSize: '13px',
                      textAlign: 'center',
                      paddingTop: '20px',
                    },
                  }}
                  tableStyle={{
                    width: '100%',
                    fontSize: '12px',
                    color: '#232323',
                  }}
                  tbodyStyle={{ height: '200px', overflowY: 'auto' }}
                />
                <Table
                  theadWidth={[120, 120]}
                  theadTextAlign={['center', 'center']}
                  theadData={['매수 (KRW)', `수량 (${selectedCurrency})`]}
                  tbodyData={tableOrderBidBody()}
                  emptyTable={{
                    text: '정보를 불러오는 중입니다.',
                    style: {
                      fontSize: '13px',
                      textAlign: 'center',
                      paddingTop: '20px',
                    },
                  }}
                  tableStyle={{
                    width: '100%',
                    fontSize: '12px',
                    color: '#232323',
                  }}
                  tbodyStyle={{ height: '200px', overflowY: 'auto' }}
                />
              </div>
            </section>
            <div style={{ flex: 0.5 }}></div>
            <section className={styles.order_wrap}>
              <div>
                <div style={{ width: '100%', marginBottom: 20 }}>
                  <Tab
                    tabs={{
                      tabItems: [
                        {
                          key: 'pending',
                          label: '지정가',
                          onClick: () => setOrderType('pending'),
                        },
                        {
                          key: 'market',
                          label: '시장가',
                          onClick: () => setOrderType('market'),
                        },
                      ],
                      selectedTab: orderType,
                    }}
                    contentsStyle={{
                      width: '391px',
                      height: '35px',
                      backgroundColor: '#FB9310',
                    }}
                    tabStyle={{
                      backgroundColor: '#eeeeee',
                      color: '#000000',
                    }}
                    selectedTabStyle={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      border: '2.5px solid #000000',
                    }}
                  />
                  <Tab
                    tabs={{
                      tabItems: [
                        {
                          key: '매수',
                          label: `${selectedCurrency} 매수`,
                          onClick: () => setBidOrAsk('매수'),
                        },
                        {
                          key: '매도',
                          label: `${selectedCurrency} 매도`,
                          onClick: () => setBidOrAsk('매도'),
                        },
                      ],
                      selectedTab: bidOrAsk,
                    }}
                    contentsStyle={{
                      width: '391px',
                      height: '35px',
                      backgroundColor: '#eeeeee',
                      marginTop: '10px',
                    }}
                    tabStyle={{
                      color: '#000000',
                    }}
                    selectedTabStyle={{
                      backgroundColor: '#ffffff',
                      color: '#FB9310',
                      border: '2.5px solid #FB9310',
                    }}
                  />
                </div>

                <div className={styles.selling_price_item_container}>
                  <div className={styles.order_title}>주문가능</div>
                  <div className={styles.order_text}>
                    {`${0} ${bidOrAsk === '매수' ? 'KRW' : `${selectedCurrency}`}`}
                  </div>
                </div>
                {orderType !== 'market' && (
                  <div className={styles.selling_price_item_container}>
                    <div className={styles.order_title}>주문가격</div>
                    <input
                      aria-label="price"
                      className={styles.selling_price_input}
                      onChange={(e: any) => setOrderPrice(e.target.value)}
                      type="number"
                      value={orderPrice || 0}
                    />
                  </div>
                )}
                <div className={styles.selling_price_item_container}>
                  <div className={styles.order_title}>주문수량</div>
                  <input
                    aria-label="quantity"
                    className={styles.selling_price_input}
                    onChange={(e: any) => setOrderCount(e.target.value)}
                    type="number"
                    value={orderCount || 0}
                  />
                </div>
                <div className={styles.trans_hr} />
                <div className={styles.selling_price_item_container}>
                  <div className={styles.order_title}>주문금액</div>
                  <div className={styles.order_text}>
                    {`${(orderPrice && orderCount && (orderPrice * orderCount)?.toLocaleString()) || '0'} KRW`}
                  </div>
                </div>
              </div>

              <Button
                id={`${bidOrAsk}`}
                className={styles.order_button}
                btnText={`${bidOrAsk}주문`}
                inlineStyle={{
                  backgroundColor: bidOrAsk === '매수' ? '#F75467' : '#4386F9',
                }}
                btnClick={() => orderBidOrAsk()}
              />
            </section>
          </div>
          <div className={styles.history_title}>{`나의 주문내역 (총 ${orderbookHistory.length}건)`}</div>
          <Table
            theadWidth={[150, 60, 70, 135, 135, 135, 135, 80]}
            theadTextAlign={['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center']}
            theadData={['종목', '구분', '상태', '주문량', '주문가격', '총 주문금액', '주문시각', '주문취소']}
            tbodyData={orderTbodyData()}
            emptyTable={{
              // text: authStore.logged === true ? '주문내역이 없습니다.' : '로그인이 필요합니다.',
              text: '주문내역이 없습니다.',
              style: {
                fontSize: '13px',
                textAlign: 'center',
                paddingTop: '20px',
              },
            }}
            tableStyle={{
              width: '100%',
              fontSize: '12px',
              color: '#232323',
            }}
            tbodyStyle={{ height: '200px', overflowY: 'auto' }}
          />
          <div className={styles.history_title}>{`나의 체결내역 (총 ${transactionHistory?.length}건)`}</div>
          <Table
            theadWidth={[100, 100, 150, 150, 150, 150, 100]}
            theadTextAlign={['center', 'center', 'center', 'center', 'center', 'center', 'center']}
            theadData={['종목', '구분', '체결량', '체결가격', '총 주문금액', '주문시각', '주문취소']}
            tbodyData={transactionTbodyData()}
            emptyTable={{
              // text: authStore.logged === true ? '체결내역이 없습니다.' : '로그인이 필요합니다.',
              text: '체결내역이 없습니다.',
              style: {
                fontSize: '13px',
                textAlign: 'center',
                paddingTop: '20px',
              },
            }}
            tableStyle={{
              width: '100%',
              fontSize: '12px',
              color: '#232323',
            }}
            tbodyStyle={{ height: '200px', overflowY: 'auto' }}
          />
        </section>
      </div>
    </main>
  );
};

export default Exchange;
