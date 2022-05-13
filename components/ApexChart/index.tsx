import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { candleStickOptionsData } from '../../constants/ChartData';
import { barOptionsData } from '../../constants/ChartData';
import styles from './ApexChart.module.scss';
const ReactApexChart = dynamic(import('react-apexcharts'), { ssr: false });

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

interface ApexChartProps {
  series: Array<CandleData>;
  barSeries: Array<BarData>;
}

export const ApexChart = (props: ApexChartProps) => {
  const [options, setOptions] = useState<any>(candleStickOptionsData);
  const [barOptions, setBarOptions] = useState<any>(barOptionsData);
  return (
    <div className={styles.contents_wrap}>
      <ReactApexChart
        options={options}
        series={[{ data: props?.series }]}
        type="candlestick"
        width={900}
        height={290}
      />
      <div>
        <ReactApexChart
          options={barOptions}
          series={[{ data: props?.barSeries }]}
          type="bar"
          width={900}
          height={160}
        />
      </div>
      )
    </div>
  );
};
