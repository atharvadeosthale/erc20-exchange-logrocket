import { useAddress, useMetamask } from "@thirdweb-dev/react";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const connectWithMetamask = useMetamask();
  const router = useRouter();
  const address = useAddress();

  useEffect(() => {
    if (address) router.replace("/exchange");
  }, [address]);

  return (
    <div>
      <Head>
        <title>Exchange TEST tokens</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="home__container">
        <h1>Sign in to exchange</h1>
        <button className="home__button" onClick={connectWithMetamask}>
          Sign in using MetaMask
        </button>
      </div>
    </div>
  );
}
