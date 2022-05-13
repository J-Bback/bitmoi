import React, { CSSProperties, useRef } from 'react';
import styles from './Table.module.scss';

type PropsType = {
  theadWidth?: Array<number>;
  theadData: string[];
  theadTextAlign?: any;
  theadPadding?: string[];
  tbodyData: any;
  emptyTable: {
    text: string;
    style: React.CSSProperties;
  };
  tableStyle?: React.CSSProperties;
  tbodyStyle?: React.CSSProperties;
};

const Table = (props: PropsType) => {
  const { theadData, theadWidth, theadTextAlign, theadPadding, tbodyData, emptyTable, tableStyle, tbodyStyle } = props;
  const tbody = useRef<any>();

  const renderThead = () => {
    return theadData.map((data, i) => {
      let returnTh = null;
      const theadText = theadTextAlign ? theadTextAlign[i] : 'center';
      const theadWid = theadWidth && theadWidth[i];
      if (typeof data === 'string') {
        returnTh = (
          <th
            style={{
              alignItems: 'center',
              height: '30px',
              borderBottom: '1px solid #eeeeee',
              textAlign: theadText,
              padding: theadPadding ? theadPadding[i] : '0',
              width: `${theadWid}px`,
            }}
            key={i}>
            {data}
          </th>
        );
      }
      return returnTh;
    });
  };

  return (
    <table className={styles.table_scroll_style} style={tableStyle || {}}>
      <thead>
        <tr>{renderThead()}</tr>
      </thead>
      <tbody ref={tbody} style={tbodyStyle}>
        {(!!tbodyData && tbodyData.length > 0) || !emptyTable ? (
          tbodyData
        ) : (
          <tr>
            <td style={emptyTable.style || {}}>{emptyTable.text}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
