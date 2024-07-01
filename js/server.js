const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let cryptos = [
    {
      id: 1,
      nombre: "Bitcoin",
      simbolo: "BTC",
      fechaCreacion: "2009-01-03",
      precioActual: 35000,
      consenso: "Prueba de trabajo",
      cantidadCirculacion: 18600000,
      algoritmo: "SHA-256",
      sitioWeb: "https://bitcoin.org",
    },
    {
      id: 2,
      nombre: "Ethereum",
      simbolo: "ETH",
      fechaCreacion: "2015-07-30",
      precioActual: 2500,
      consenso: "Prueba de participación",
      cantidadCirculacion: 115000000,
      algoritmo: "Ethash",
      sitioWeb: "https://ethereum.org",
    },
    {
      id: 3,
      nombre: "Cardano",
      simbolo: "ADA",
      fechaCreacion: "2017-09-29",
      precioActual: 1.5,
      consenso: "Prueba de participación",
      cantidadCirculacion: 32000000000,
      algoritmo: "SHA-256",
      sitioWeb: "https://cardano.org",
    },
    {
      id: 4,
      nombre: "Ripple",
      simbolo: "XRP",
      fechaCreacion: "2012-02-02",
      precioActual: 0.6,
      consenso: "Acuerdo de consenso",
      cantidadCirculacion: 100000000000,
      algoritmo: "X11",
      sitioWeb: "https://ripple.com",
    },
    {
      id: 5,
      nombre: "Litecoin",
      simbolo: "LTC",
      fechaCreacion: "2011-10-13",
      precioActual: 150,
      consenso: "Prueba de trabajo",
      cantidadCirculacion: 66000000,
      algoritmo: "Scrypt",
      sitioWeb: "https://litecoin.org",
    },
  ];


app.get('/cryptos', (req, res) => {
    res.json(cryptos);
});


app.post('/cryptos', (req, res) => {
    const crypto = req.body;
    cryptos.push(crypto);
    res.status(201).json(crypto);
});


app.delete('/cryptos/:id', (req, res) => {
    const { id } = req.params;
    cryptos = cryptos.filter(crypto => crypto.id !== parseInt(id));
    res.status(204).send();
});

app.delete('/cryptos', (req, res) => {
    cryptos = [];
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});