import React, { useEffect, useRef, useState } from "react";
import { Block } from "./Block";
import "./index.scss";

function App() {
  const [fromCurrency, setFromCurrency] = useState("RUB");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);
  const ratesRef = useRef({});

  useEffect(() => {
    fetch("https://www.floatrates.com/daily/usd.json")
      .then((res) => res.json())
      .then((json) => {
        ratesRef.current = json;
        onChangeToPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не удалось получить информацию");
      });
  }, []);
  const onChangeFromPrice = (value) => {
    const selectedCurrency = ratesRef.current[fromCurrency.toLowerCase()].rate;
    const price = value / selectedCurrency;
    const targetCurrency = ratesRef.current[toCurrency.toLowerCase()].rate;
    const result = price * targetCurrency;
    setFromPrice(value);
    setToPrice(result.toFixed(2));
  };
  const onChangeToPrice = (value) => {
    const selectedCurrency = ratesRef.current[fromCurrency.toLowerCase()];
    const targetCurrency = ratesRef.current[toCurrency.toLowerCase()];
    const result = (selectedCurrency.rate / targetCurrency.rate) * value;
    setFromPrice(result.toFixed(2));
    setToPrice(value);
  };
  useEffect(() => {
    if (Object.keys(ratesRef.current).length > 0) {
      onChangeFromPrice(fromPrice);
    }
  }, [fromPrice, fromCurrency, ratesRef.current]);

  useEffect(() => {
    if (Object.keys(ratesRef.current).length > 0) {
      onChangeToPrice(toPrice);
    }
  }, [toPrice, toCurrency, ratesRef.current]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
