import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import initializeStore from '../../stores';

import { coinNameKR } from '../../constants/NameParser';

import Table from '../../components/Table';

import styles from './Asset.module.scss';
import CallApi from '../../utils/callApi';

type Props = {};

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

type Wallet = {
  appraisalAmount: number;
  holdings: number;
  krw: number;
  purchaseAmount: number;
  valuationPl: number;
  yield: number;
};

const initialWallet = {
  appraisalAmount: 0,
  holdings: 0,
  krw: 0,
  purchaseAmount: 0,
  valuationPl: 0,
  yield: 0,
};

const coinList = [
  '비트코인', // 0
  '이더리움',
  '라이트코인',
  '이더리움클래식',
  '리플',
  '비트코인캐시',
  '퀀텀',
  '비트코인골드',
  '이오스',
  '아이콘',
  '트론', // 10
];

export default function Asset({}: Props) {
  const [orderbookHistory, setOrderbookHistory] = useState<Array<OrderBookHistory>>([]);
  const [wallet, setWallet] = useState<Wallet>(initialWallet);

  const router = useRouter();
  const store = initializeStore();
  const { authStore } = store;

  useEffect(() => {
    // 로그인 상태가 아니면 로그인 화면
    if (authStore.logged === false) {
      router.push({
        pathname: '/login',
      });
    } else {
      getWallet();
      getOrderBookHistory();
    }
  }, []);

  useEffect(() => {
    getOrderBookHistory();
  }, [orderbookHistory]);

  const getWallet = async () => {
    const data = {
      disabledErrorHandler: true,
      method: 'GET',
      url: 'http://52.78.124.218:9000/user/wallet',
    };

    try {
      const response: any = await CallApi(data);
      const responseJson: Wallet = await response.json();
      if (response?.status === 200) {
        setWallet(responseJson);
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

  // const getOrderBookHistory = async () => {
  //   try {
  //     const url = 'http://52.78.124.218:9000/orderbook';
  //     const data = {
  //       method: 'GET',
  //       url: url,
  //     };

  //     const response: any = await CallApi(data);
  //     const responseJson: Array<OrderBookHistory> = await response.json();
  //     if (response.status === 200) {
  //       setOrderbookHistory(responseJson);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const orderTbodyData = () => {
    return orderbookHistory?.map((item: OrderBookHistory, i: number) => {
      return (
        <tr
          key={i}
          style={{
            textAlign: 'center',
            height: '30px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}>
          <td style={{ width: 200 }}>{coinList[item.coinid]}</td>
          <td
            style={{
              color: item.types === 'bid' ? '#D13C4B' : item.types === 'ask' ? '#1F5ED2' : '#000000',
              width: 100,
            }}>
            {item.types === 'bid' ? '매수' : item.types === 'ask' ? '매도' : '거절'}
          </td>
          <td style={{ width: 100 }}>{item.state === 'wait' ? '대기' : item.state === 'cancel' ? '취소' : '체결'}</td>
          <td style={{ width: 150 }}>{`${Number(item.quantity).toLocaleString()}`}</td>
          <td style={{ width: 150 }}>{`${Number(item.price).toLocaleString()} KRW`}</td>
          <td style={{ width: 150 }}>{`${Number(item.quantity * item.price).toLocaleString()} KRW`}</td>
          <td style={{ width: 150 }}>
            {dayjs(
              `${item.createdat[0]}-${item.createdat[1]}-${item.createdat[2]} ${item.createdat[3]}:${item.createdat[4]}`
            ).format('YYYY-MM-DD HH:mm')}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className={styles.asset_container}>
      <div className={styles.header_wrap}>
        <div className={styles.header_box}>
          <div style={{ padding: 20 }}>
            <div className={styles.header_title}>
              <h3>자산현황</h3>
            </div>
          </div>
          <div style={{ marginTop: 65 }}>
            <div className={styles.asset_box} style={{ color: '#000000' }}>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>보유 KRW</div>
                <div className={styles.asset_bold_text}>{`${wallet?.krw?.toLocaleString() || 0} KRW`}</div>
              </div>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 보유자산</div>
                <div className={styles.asset_bold_text}>{`${wallet?.holdings?.toLocaleString() || 0} KRW`}</div>
              </div>
            </div>
            <div className={styles.asset_box} style={{ color: '#000000' }}>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 매수금액</div>
                <div>{`${wallet?.purchaseAmount?.toLocaleString() || 0} KRW`}</div>
              </div>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 평가금액</div>
                <div>{`${wallet?.appraisalAmount?.toLocaleString() || 0} KRW`}</div>
              </div>
            </div>
            <div className={styles.asset_box} style={{ color: '#000000' }}>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 평가손익</div>
                <div>{`${Number(wallet?.valuationPl)?.toLocaleString() || 0} KRW`}</div>
              </div>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 평가수익률</div>
                <div>{`${Math.round(wallet?.yield * 100) / 100} %`}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.contents_wrap}>
        <Table
          theadWidth={[200, 100, 100, 150, 150, 150, 150]}
          theadTextAlign={['center', 'center', 'center', 'center', 'center', 'center', 'center']}
          theadData={['종목', '구분', '상태', '주문량', '주문가격', '총 주문금액', '주문시각']}
          tbodyData={orderTbodyData()}
          emptyTable={{
            text: '주문 내역이 없습니다.',
            style: {
              fontSize: '13px',
              textAlign: 'center',
              paddingTop: '20px',
            },
          }}
          tableStyle={{
            width: '1200px',
            // maxHeight: 'calc(100vh - 480px)',
            justifyItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #eeeeee',
            borderRadius: '3px',
          }}
          tbodyStyle={{ minHeight: 'calc(100vh - 420px)', overflowY: 'auto' }}
        />
      </div>
    </div>
  );
}
