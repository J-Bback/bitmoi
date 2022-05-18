import React from 'react';
import Table from '../../components/Table';
import styles from '../ranking/Ranking.module.scss';

const Ranking = () => {
  const openWalletModal = () => {
    console.log('modal 띄우기');
  };
  const tbodyData = () => {
    const temp = [
      {
        rank: 1,
        name: 'bitmoi',
        asset: '1,000,000,000',
        benefit: 375,
        holdings: '확인',
      },
      {
        rank: 2,
        name: '워뇨띠',
        asset: '100,000,000',
        benefit: 122,
        holdings: '확인',
      },
      {
        rank: 3,
        name: '해적왕루피',
        asset: '10,000,000',
        benefit: 99,
        holdings: '확인',
      },
      {
        rank: 4,
        name: '냐옹이',
        asset: '1,000,000',
        benefit: 3,
        holdings: '확인',
      },
    ];

    return temp?.map((item: any, i: number) => {
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
          <td style={{ width: 1200 / 5 }}>{item.rank}</td>
          <td style={{ width: 1200 / 5 }}>{item.name}</td>
          <td style={{ width: 1200 / 5 }}>{item.asset}</td>
          <td style={{ width: 1200 / 5 }}>{`${item.benefit}%`}</td>
          <td style={{ width: 1200 / 5, justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <div className={styles.modal_button} onClick={() => openWalletModal()}>
              {item.holdings}
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
