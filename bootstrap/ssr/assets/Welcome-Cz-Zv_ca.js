import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Select from "@mui/material/Select/index.js";
import MenuItem from "@mui/material/MenuItem/index.js";
import Container from "@mui/material/Container/index.js";
import Paper from "@mui/material/Paper/index.js";
import InputBase from "@mui/material/InputBase/index.js";
import Grid from "@mui/material/Grid/index.js";
import Typography from "@mui/material/Typography/index.js";
import Box from "@mui/material/Box/index.js";
import Skeleton from "@mui/material/Skeleton/index.js";
function Welcome({ cryptos, fiats, exchange }) {
  const [cryptoValue, setCryptoValue] = useState("");
  const [fiatValue, setFiatValue] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState(/* @__PURE__ */ new Date());
  useState(null);
  const [secondsUntilUpdate, setSecondsUntilUpdate] = useState(60);
  const [fromTo, setFromTo] = useState("crypto-fiat");
  const [isLoaded, setIsLoaded] = useState(false);
  var title = "Crypto calculator: " + cryptoCurrency + " to " + fiatCurrency;
  const [exchangeRate, setExchangeRate] = useState(1);
  const handleCryptoChange = (e) => {
    setCryptoValue(e.target.value);
    setFiatValue((e.target.value * exchangeRate).toFixed(2));
    setFromTo("crypto-fiat");
  };
  const handleFiatChange = (e) => {
    setFiatValue(e.target.value);
    setCryptoValue((e.target.value / exchangeRate).toFixed(8));
    setFromTo("fiat-crypto");
  };
  const handleCryptoCurrencyChange = (e) => {
    setCryptoCurrency(e.target.value);
    setFiatValue((cryptoValue * exchangeRate).toFixed(2));
    title = "Crypto calculator: " + e.target.value + " to " + fiatCurrency;
  };
  const handleFiatCurrencyChange = (e) => {
    setFiatCurrency(e.target.value);
    setCryptoValue((fiatValue / exchangeRate).toFixed(8));
    title = "Crypto calculator: " + cryptoCurrency + " to " + e.target.value;
  };
  useEffect(() => {
    const fetchExchangeRate = async () => {
      const url = `http://127.0.0.1:8000/api/price?crypto=${cryptoCurrency}&fiat=${fiatCurrency}`;
      try {
        setIsLoaded(true);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setExchangeRate(data.price);
          setLastUpdated(data.timestamp);
          if (fromTo == "crypto-fiat") {
            setFiatValue((cryptoValue * data.price).toFixed(2));
          } else {
            setCryptoValue((fiatValue / data.price).toFixed(8));
          }
          await new Promise((resolve) => setTimeout(resolve, 1e3));
          setIsLoading(false);
        } else {
          console.error("Exchange rate fetch failed:", response.status);
        }
      } catch (error) {
        console.error("Exchange rate fetch error:", error);
      }
    };
    fetchExchangeRate();
    const intervalId = setInterval(() => {
      setSecondsUntilUpdate((prevSeconds) => {
        if (prevSeconds <= 1) {
          fetchExchangeRate();
          return 60;
        } else {
          return prevSeconds - 1;
        }
      });
    }, 1e3);
    return () => clearInterval(intervalId);
  }, [cryptoCurrency, fiatCurrency]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title }),
    /* @__PURE__ */ jsx(Container, { maxWidth: "md", children: /* @__PURE__ */ jsx(Box, { fullWidth: true, sx: { height: "100vh", width: "100%" }, display: "flex", alignItems: "center", justifyContent: "center", children: /* @__PURE__ */ jsxs(Paper, { elevation: 12, sx: { p: 2, backgroundColor: "#cbcbcb" }, children: [
      /* @__PURE__ */ jsxs(Grid, { container: true, spacing: 2, children: [
        /* @__PURE__ */ jsx(Grid, { item: true, xs: 6, children: /* @__PURE__ */ jsx(Paper, { elevation: 3, sx: { mb: 2, p: 1 }, children: /* @__PURE__ */ jsxs(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsx(Grid, { item: true, xs: 8, children: isLoaded ? /* @__PURE__ */ jsx(Skeleton, { animation: "wave" }) : /* @__PURE__ */ jsx(
            InputBase,
            {
              id: "crypto-input",
              value: cryptoValue,
              onChange: handleCryptoChange,
              fullWidth: true
            }
          ) }),
          /* @__PURE__ */ jsx(Grid, { item: true, xs: 4, children: /* @__PURE__ */ jsx(
            Select,
            {
              value: cryptoCurrency,
              label: "Currency",
              onChange: handleCryptoCurrencyChange,
              variant: "standard",
              disableUnderline: true,
              fullWidth: true,
              children: cryptos.map((crypto) => /* @__PURE__ */ jsx(MenuItem, { value: crypto, children: crypto }, crypto))
            }
          ) })
        ] }) }) }),
        /* @__PURE__ */ jsx(Grid, { item: true, xs: 6, children: /* @__PURE__ */ jsx(Paper, { elevation: 3, sx: { mb: 2, p: 1 }, children: /* @__PURE__ */ jsxs(Grid, { container: true, spacing: 2, children: [
          /* @__PURE__ */ jsx(Grid, { item: true, xs: 8, children: isLoaded ? /* @__PURE__ */ jsx(Skeleton, { animation: "wave" }) : /* @__PURE__ */ jsx(
            InputBase,
            {
              id: "fiat-input",
              value: fiatValue,
              onChange: handleFiatChange,
              fullWidth: true
            }
          ) }),
          /* @__PURE__ */ jsx(Grid, { item: true, xs: 4, children: /* @__PURE__ */ jsx(
            Select,
            {
              value: fiatCurrency,
              label: "Currency",
              onChange: handleFiatCurrencyChange,
              variant: "standard",
              disableUnderline: true,
              fullWidth: true,
              children: fiats.map((fiat) => /* @__PURE__ */ jsx(MenuItem, { value: fiat, children: fiat }, fiat))
            }
          ) })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs(Grid, { container: true, spacing: 2, children: [
        /* @__PURE__ */ jsxs(Grid, { item: true, xs: 8, children: [
          /* @__PURE__ */ jsxs(Typography, { variant: "overline", display: "span", gutterBottom: true, children: [
            /* @__PURE__ */ jsx("b", { children: "Price:" }),
            " 1",
            cryptoCurrency,
            " =",
            isLoaded ? /* @__PURE__ */ jsx(Skeleton, { animation: "wave" }) : Intl.NumberFormat("en-US", { style: "currency", currency: fiatCurrency }).format(
              exchangeRate
            )
          ] }),
          /* @__PURE__ */ jsx("br", {})
        ] }),
        /* @__PURE__ */ jsxs(Grid, { item: true, xs: 4, children: [
          /* @__PURE__ */ jsxs(Typography, { variant: "overline", display: "span", gutterBottom: true, children: [
            /* @__PURE__ */ jsx("b", { children: "Next update:" }),
            " ",
            secondsUntilUpdate,
            " sec"
          ] }),
          /* @__PURE__ */ jsx("br", {})
        ] })
      ] })
    ] }) }) })
  ] });
}
export {
  Welcome as default
};
