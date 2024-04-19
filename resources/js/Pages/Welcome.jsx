import { Link, Head } from "@inertiajs/react";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function Welcome({ cryptos, fiats, exchange }) {
  const [cryptoValue, setCryptoValue] = useState("");
  const [fiatValue, setFiatValue] = useState("");
  const [cryptoCurrency, setCryptoCurrency] = useState("BTC");
  const [fiatCurrency, setFiatCurrency] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [previousUpdated, setPreviousUpdated] = useState(null);
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

  const formattedPrice = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: fiatCurrency
    }).format(exchangeRate);
  }, [exchangeRate, fiatCurrency]);

  useEffect(() => {
    const fetchExchangeRate = async () => {
        setIsLoaded(true);
        const url = `http://127.0.0.1:8000/api/price?crypto=${cryptoCurrency}&fiat=${fiatCurrency}`;
        try {
          const response = await fetch(url);
          if (response.ok) {
            
            const data = await response.json();
            setExchangeRate(data.price);
            setLastUpdated(data.timestamp);
            if (fromTo === "crypto-fiat") {
              setFiatValue((cryptoValue * data.price).toFixed(2));
            } else {
              setCryptoValue((fiatValue / data.price).toFixed(8));
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsLoaded(false);
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
    }, 1000);

    return () => clearInterval(intervalId);
  }, [cryptoCurrency, fiatCurrency]);

  return (
    <>
      <Head title={title} />
      <Container maxWidth="md">
        <Box
          fullWidth
          sx={{ height: "100vh", width: "100%" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Paper elevation={12} sx={{ p: 2, backgroundColor: "#cbcbcb", width: '100%' }}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <Paper elevation={1} sx={{ mb: 2, p: 1, width: '100%' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Box fullWidth>
                        {isLoaded ? (
                          <Skeleton animation="wave" variant="rectangular" width="100%" height={40} />
                        ) : (
                          <InputBase id="crypto-input" value={cryptoValue} onChange={handleCryptoChange} fullWidth />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        value={cryptoCurrency}
                        label="Currency"
                        onChange={handleCryptoCurrencyChange}
                        variant="standard"
                        disableUnderline
                        fullWidth
                      >
                        {cryptos.map((crypto) => (
                          <MenuItem key={crypto} value={crypto}>
                            {crypto}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={1} sx={{ mb: 2, p: 1 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <Box fullWidth>
                        {isLoaded ? (
                          <Skeleton animation="wave" variant="rectangular" width="100%" height={40} />
                        ) : (
                          <InputBase id="fiat-input" value={fiatValue} onChange={handleFiatChange} fullWidth />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        value={fiatCurrency}
                        label="Currency"
                        onChange={handleFiatCurrencyChange}
                        variant="standard"
                        disableUnderline
                        fullWidth
                      >
                        {fiats.map((fiat) => (
                          <MenuItem key={fiat} value={fiat}>
                            {fiat}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={8}>
                {isLoaded ? (
                  <Skeleton animation="wave" variant="rectangular" width="100%" height={22} sx={{mt: 1, mb: 0}}/>
                ) : (
                  <Typography variant="overline" display="span" gutterBottom>
                    <b>Price:</b> 1{cryptoCurrency} ={" "} {Intl.NumberFormat("en-US", { style: "currency", currency: fiatCurrency }).format(
                          exchangeRate
                        )}
                  </Typography>
                )}
                
                <br />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="overline" display="span" gutterBottom>
                  <b>Next update:</b> {secondsUntilUpdate} sec
                </Typography>
                <br />
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Container>
    </>
  );
}
