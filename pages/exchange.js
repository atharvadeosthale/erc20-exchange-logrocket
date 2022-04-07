import { useAddress } from "@thirdweb-dev/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { tokenABI, vendorABI } from "../contracts";
const web3 = new Web3(Web3.givenProvider);

function Exchange() {
  const [tokens, setTokens] = useState();
  const [matic, setMatic] = useState(0);
  const address = useAddress();
  const router = useRouter();

  const purchase = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const vendor = new web3.eth.Contract(
        vendorABI,
        process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS
      );
      const request = await vendor.methods.buyTokens().send({
        from: accounts[0],
        value: web3.utils.toWei(matic.toString(), "ether"),
      });
      alert("You have successfully purchased TEST tokens!");
      console.log(request);
    } catch (err) {
      console.error(err);
      alert("Error purchasing tokens");
    }
  };

  const sell = async () => {
    try {
      const accounts = await web3.eth.getAccounts();
      const tokenContract = new web3.eth.Contract(
        tokenABI,
        process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS
      );
      // Approve the contract to spend the tokens
      let request = await tokenContract.methods
        .approve(
          process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS,
          web3.utils.toWei(tokens, "ether")
        )
        .send({
          from: accounts[0],
        });

      // Trigger the selling of tokens
      const vendor = new web3.eth.Contract(
        vendorABI,
        process.env.NEXT_PUBLIC_VENDOR_CONTRACT_ADDRESS
      );
      request = await vendor.methods
        .sellTokens(web3.utils.toWei(tokens, "ether"))
        .send({
          from: accounts[0],
        });

      alert("You have successfully sold TEST tokens!");
      console.log(request);
    } catch (err) {
      console.error(err);
      alert("Error selling tokens");
    }
  };

  useEffect(() => {
    if (!address) router.replace("/");
  }, [address]);

  useEffect(() => {
    setMatic(tokens / 100);
  }, [tokens]);

  return (
    <div>
      <Head>
        <title>Exchange TEST tokens</title>
      </Head>
      <div className="exchange__container">
        <h1>Purchase TEST Tokens</h1>
        <input
          type="number"
          placeholder="Amount of tokens"
          className="exchange__textBox"
          value={tokens}
          onChange={(e) => setTokens(e.target.value)}
        />
        <div>MATIC equivalent: {matic}</div>
        <button className="exchange__button" onClick={purchase}>
          Purchase
        </button>
        <button className="exchange__button" onClick={sell}>
          Sell
        </button>
      </div>
    </div>
  );
}

export default Exchange;
