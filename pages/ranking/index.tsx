import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import styles from '../ranking/Ranking.module.scss';
import CallApi from '../../utils/callApi';

type Ranking = {
  assets: number;
  name: string;
  ranking: number;
  userId: number;
  yeild: number;
};

type UserWallet = {
  avgPrice: number;
  coinId: number;
  createdAt: number[];
  quantity: number;
  updatedAt: number[];
  userId: number;
  waitingQty: number;
  walletId: number;
};

const Ranking = () => {
  const [rankingList, setRankingList] = useState<Array<Ranking>>([]);
  const [userWallet, setUserWallet] = useState<Array<UserWallet>>([]);

  useEffect(() => {
    getRankingList();
  }, []);

  const getRankingList = async () => {
    const data = {
      disabledErrorHandler: true,
      method: 'GET',
      url: 'http://52.78.124.218:9000/user/ranking',
    };

    try {
      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response?.status === 200) {
        setRankingList(responseJson);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserWallet = async (userId: any) => {
    const data = {
      disabledErrorHandler: true,
      method: 'GET',
      url: `http://52.78.124.218:9000/user/asset/${userId}`,
    };

    try {
      const response: any = await CallApi(data);
      const responseJson: any = await response.json();
      if (response?.status === 200) {
        setUserWallet(responseJson);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openWalletModal = (userId: number) => {
    getUserWallet(userId);
  };

  const tbodyData = () => {
    return rankingList?.map((item: Ranking, i: number) => {
      return (
        <tr
          key={i}
          style={{
            display: 'flex',
            textAlign: 'center',
            height: '35px',
            alignItems: 'center',
            backgroundColor: '#ffffff',
          }}>
          <td style={{ width: 1200 / 5 }}>{item.ranking}</td>
          <td style={{ width: 1200 / 5 }}>{item.name}</td>
          <td style={{ width: 1200 / 5 }}>{item.assets.toLocaleString()}</td>
          <td style={{ width: 1200 / 5 }}>{`${Math.round(item.yeild * 100) / 100} %`}</td>
          <td style={{ width: 1200 / 5, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <div className={styles.modal_button} onClick={() => openWalletModal(item.userId)}>
              {'확인'}
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.ranking_wrap}>
          <div className={styles.ranking}>
            <img src="/images/rank2.png" style={{ width: 50, height: 'auto' }} />
          </div>
          <div className={styles.rank}>
            <img src="/images/rank1.png" style={{ width: 50, height: 'auto' }} />
          </div>
          <div className={styles.ranking}>
            <img src="/images/rank3.png" style={{ width: 50, height: 'auto' }} />
          </div>
        </div>

        <p className={styles.font_title}>명예의 전당</p>
        <Table
          theadWidth={[1200 / 5, 1200 / 5, 1200 / 5, 1200 / 5, 1200 / 5]}
          theadTextAlign={['center', 'center', 'center', 'center', 'center']}
          theadData={['순위', '닉네임', '총 자산', '수익률', '보유현황']}
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
    </div>
  );
};

export default Ranking;
