import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { setCookie, getCookie } from '../../utils/cookie';
import { coinNameKR } from '../../constants/NameParser';

import Table from '../../components/Table';

import styles from './Asset.module.scss';

type Props = {};

export default function Asset({}: Props) {
  const [assetList, setAssetList] = useState();

  const router = useRouter();

  useEffect(() => {
    // 로그인 상태가 아니면 로그인 화면
    const cookie = getCookie('favoriteCoins');
    if (!cookie) {
      router.push({
        pathname: '/login',
      });
    }
  }, []);

  const orderTbodyData = () => {
    const temp = ['a', 'a', 'a', 'a', 'a', 'a'];

    return temp?.map((item: any, i: number) => {
      return (
        <tr
          key={i}
          style={{
            textAlign: 'center',
            height: '30px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}>
          <td style={{ width: 200 }}>{coinNameKR['BTC']}</td>
          <td style={{ color: assetList ? '#D13C4B' : '#1F5ED2', width: 100 }}>{'매도'}</td>
          <td style={{ width: 100 }}>대기</td>
          <td style={{ width: 150 }}>22.7894000</td>
          <td style={{ width: 150 }}>1,000,000</td>
          <td style={{ width: 150 }}>{(1000000 * 22.7894).toLocaleString()}</td>
          <td style={{ width: 150 }}>05-15 03:22</td>
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
                <div className={styles.asset_bold_text}>15,000,000 KRW</div>
              </div>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 보유자산</div>
                <div className={styles.asset_bold_text}>30,000,000 KRW</div>
              </div>
            </div>
            <div className={styles.asset_box} style={{ color: '#000000' }}>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 매수금액</div>
                <div>15,000,000 KRW</div>
              </div>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 평가금액</div>
                <div>30,000,000 KRW</div>
              </div>
            </div>
            <div className={styles.asset_box} style={{ color: '#000000' }}>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 평가손익</div>
                <div>-15,000,000 KRW</div>
              </div>
              <div className={styles.asset_row} style={{ color: '#000000' }}>
                <div>총 평가수익률</div>
                <div>-16.67 %</div>
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
            maxHeight: 'calc(100vh - 480px)',
            justifyItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #eeeeee',
            borderRadius: '3px',
          }}
          tbodyStyle={{ height: 'calc(100vh - 420px)', overflowY: 'auto' }}
        />
      </div>
    </div>
  );
}
