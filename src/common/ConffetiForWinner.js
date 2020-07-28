import ConfettiCannon from 'react-native-confetti-cannon';
import React,{Component} from "react";

const ConffetiForWinner = () => (
  <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
);

export default ConffetiForWinner;