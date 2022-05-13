import React from 'react';
import styles from './Tab.module.scss';

type Item = {
  key: string;
  label: string;
  onClick: Function;
};
interface PropsType {
  contentsStyle?: React.CSSProperties;
  // onClick?: Function;
  tabs?: {
    tabItems: Array<Item>;
    selectedTab: string | string[] | undefined;
  };
}

const Tab = (props: PropsType) => {
  const { tabs } = props;

  return (
    <div className={styles.tab_wrap} style={props?.contentsStyle ?? {}}>
      {tabs?.tabItems.map((tab: any, i: number) => {
        return (
          <div
            key={i}
            className={`${styles.tab} ${tab.key === tabs.selectedTab && styles.selected_tab}`}
            onClick={() => tab.onClick()}>
            {tab.label}
          </div>
        );
      })}
    </div>
  );
};

export default Tab;
