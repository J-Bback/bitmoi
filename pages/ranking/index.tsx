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
        openWalletModal(responseJson);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const openWalletModal = (data: Array<UserWallet>) => {
    console.log('userWallet DATA', data);
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
          <td style={{ width: 1200 / 5 }}>{`${item.assets.toLocaleString()} KRW`}</td>
          <td style={{ width: 1200 / 5 }}>{`${Math.round(item.yeild * 100) / 100} %`}</td>
          <td style={{ width: 1200 / 5, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <div className={styles.modal_button} onClick={() => getUserWallet(item.userId)}>
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
            <div style={{ textAlign: 'right', marginTop: -40 }}>
              <div style={{ padding: '10px 20px' }}>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {`${rankingList[1]?.name}`}
                  <span style={{ fontSize: 13, fontWeight: 'normal' }}>님</span>
                </p>
                <div style={{ marginTop: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#979797' }}>총 자산</p>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                    {rankingList[1]?.assets.toLocaleString()}
                    <span style={{ fontSize: 12, color: '#979797' }}> KRW</span>
                  </p>
                </div>
                <div style={{ marginTop: 10 }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#979797' }}>총 수익률</p>
                  <p style={{ fontWeight: 'bold', margin: 0 }}>
                    {Math.round(rankingList[1]?.yeild * 100) / 100}
                    <span style={{ fontSize: 12, color: '#979797' }}> %</span>
                  </p>
                </div>
              </div>
            </div>
            <img src="/images/rankperson2.png" style={{ position: 'absolute', width: 220, bottom: 0, left: 0 }} />
          </div>
          <div className={styles.rank}>
            <img src="/images/rank1.png" style={{ width: 50, height: 'auto' }} />
            <div style={{ padding: '10px 50px' }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>
                {`${rankingList[0]?.name}`}
                <span style={{ fontSize: 13, fontWeight: 'normal' }}>님</span>
              </p>
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#979797' }}>총 자산</p>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {rankingList[0]?.assets.toLocaleString()}
                  <span style={{ fontSize: 12, color: '#979797' }}> KRW</span>
                </p>
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#979797' }}>총 수익률</p>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {Math.round(rankingList[0]?.yeild * 100) / 100}
                  <span style={{ fontSize: 12, color: '#979797' }}> %</span>
                </p>
              </div>
            </div>

            <img src="/images/rankperson1.png" style={{ position: 'absolute', width: 290, bottom: 0, right: -10 }} />
          </div>
          <div className={styles.ranking}>
            <img src="/images/rank3.png" style={{ width: 50, height: 'auto' }} />
            <div style={{ padding: '0 50px', marginTop: -30 }}>
              <p style={{ fontWeight: 'bold', margin: 0 }}>
                {`${rankingList[2]?.name}`}
                <span style={{ fontSize: 13, fontWeight: 'normal' }}>님</span>
              </p>
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#979797' }}>총 자산</p>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {rankingList[2]?.assets.toLocaleString()}
                  <span style={{ fontSize: 12, color: '#979797' }}> KRW</span>
                </p>
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#979797' }}>총 수익률</p>
                <p style={{ fontWeight: 'bold', margin: 0 }}>
                  {Math.round(rankingList[2]?.yeild * 100) / 100}
                  <span style={{ fontSize: 12, color: '#979797' }}> %</span>
                </p>
              </div>
            </div>
            <img src="/images/rankperson3.png" style={{ position: 'absolute', width: 270, bottom: 0, right: -20 }} />
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
