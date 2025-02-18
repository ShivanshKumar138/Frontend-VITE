import React from 'react';
import './CoinBox.css';
import coinimg from '../../assets/coin.png';

function CoinBox({ coinboxAmount, coinboxDay, onClick, disabled }) {
  return (
    <div 
      className={`coinbox-container ${disabled ? 'disabled' : ''}`} 
      onClick={disabled ? null : onClick}
    >
      <div className='coinbox-amount' style={{color: "black"}}>{coinboxAmount}</div>
      <div className="coinbox-image">
        <img src={coinimg} alt="" />
      </div>
      <div className="coinbox-day" style={{color: "grey"}}>{coinboxDay}</div>
    </div>
  );
}

export default CoinBox;