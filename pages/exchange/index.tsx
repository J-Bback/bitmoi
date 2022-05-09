import React, {
	useState,
	useEffect,
	useRef,
	createRef,
	useContext,
} from "react";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "next/router";

import Image from "next/image";
import { UseWindowSize } from "./hooks/UseWindowSize";

import styles from "./Exchange.module.scss";

const Exchange = (props: any) => {

  return (
    <main className={styles.exchange_wrap}>
      <div className={styles.container}>
        <section className={styles.side_bar_wrap}>
          {'라라라라라라'}
        </section>
      </div>
    </main>
  )
}

export default Exchange;