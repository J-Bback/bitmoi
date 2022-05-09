import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import styles from "./Home.module.scss";

const Home = (props: any) => {

  return (
    <div className={styles.container}>
      <div className={styles.contents_wrap}>
        {'안녕하세요'}
      </div>
    </div>
  )
}

export default Home;