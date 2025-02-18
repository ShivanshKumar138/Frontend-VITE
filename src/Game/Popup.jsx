import React from "react";

const Popup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "300px",
        padding: "0",
        backgroundColor: "white",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        color: "white",
        zIndex: 1000,
      }}
    >
      {" "}
      <div
        style={{
          background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <h2 style={{ margin: 0, color: "white" }}>How to play</h2>
      </div>
      <div
        style={{
          padding: "20px",
          maxHeight: "400px",
          overflowY: "auto",
          textAlign: "left ",
          color: "black",
        }}
      >
        <p>
          What is a hash value?
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          Anyone who knows the basics of Bitcoin will be exposed to a concept, a
          hash value. Bitcoin's block header has a hash of the previous block in
          it, which is used to point to the previous block.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          Hash is the transliteration of English hash, we can also translate it
          into hash, so hash value is also called - hash value. A hash value is
          a value calculated with a hash function (or hash function/hash
          algorithm). To understand hash values, one must understand the nature
          of hash functions. A hash function can computationally transform an
          input of arbitrary length into an output of fixed length.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          Every hash function has the property that if the input value is the
          same, the output hash value is the same. If the input values are
          different, the output hashes are usually different, but there is a
          very small chance of a hash collision. If a hash collision is ruled
          out with a slight change in the input value, a completely unrelated
          hash value is output. Since the hash function is irreversible and easy
          to verify, it is almost impossible to reverse the input value through
          the output hash value. If there is an input value, the corresponding
          hash value can be verified immediately.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          Therefore, the hash value of each block is unique, random,
          unbreakable, unforgeable, the block hash value is automatically
          identified, and the record cannot be tampered with.
        </p>
        <p>
          How many types of USDT are there?
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          1. Omni-USDT based on the Bitcoin network, the deposit address is the
          BTC address, and the deposit and withdrawal go through the BTC
          network;
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          2. ERC20-USDT based on the Ethereum ERC20 protocol, the deposit
          address is the ETH address, and the deposit and withdrawal go through
          the ETH network;
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          3. TRC20-USDT based on TRON TRC20 protocol and TRX (TRON) network, the
          deposit address is the TRON address, and the deposit and withdrawal go
          through the TRON network.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          TrxHash is the TRC20-USDT Block hash based on the TRON TRC20 protocol
          and TRX (TRON) network. The last number is used as the result of the
          lottery to determine whether you have won the lottery (click Block
          Height to go to the public chain to query the unique Block hash)
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          The rules of play are as follows:
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          1. 1 lottery draw for 1 minute, purchase within 45 seconds, and the
          result cannot be purchased within 15 seconds before opening.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          2. Purchase All Day Unlock. The total number of purchases in one day
          is 1440.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          3. 3 points 1 time, 5 points 1 time, 10 points 1 time, the rules are
          the same as 1 point 1 time except the draw time is different.
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          4. The last digit of the Block hash is used as the lottery result:
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          Eg:
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          If the hash value is **b569, the lottery result is 9
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          Hash value **d14, the lottery result is 4
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          if you spend 100 to trade, after deducting service fee 2%, contract
          amount: 98
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          I Choose green: if the result shows 1,3,7,9, you will get (98 * 2)
          =196 ; if the result shows 5, you will get (98 * 2) = 196
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          I choose red: if the result shows 2,4,6,8, you will get (98 * 2) =196;
          if the result shows 0, you will get(98 * 2) = 196
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          I choose purple: if the result shows 0 or 5, you will get (98 * 2) =
          196
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          I Select the number: If the result of opening is the same as the one
          you selected, you will get (98 * 9) = 882
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>
          I Choose Big: if the result shows 5,6,7,8,9 you will get (98 * 2) =
          196
          <br />
          <span style={{ display: "block", marginBottom: "20px" }}></span>I
          Select Small: if the result shows 0,1,2,3,4 you will get (98 * 2) =
          196
        </p>
      </div>
      <div
        style={{
          background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "10px 20px",
            width: "fit-content",
            margin: "0 auto",
            textAlign: "center",
            color: "#4782ff",
            cursor: "pointer",
            borderRadius: "5px", // Make it look more like a button
            fontWeight:"bold"
          }}
          onClick={onClose} // Attach onClick event to the inner div
        >
          Close
        </div>
      </div>
    </div>
  );
};

export default Popup;
