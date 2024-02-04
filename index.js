const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/webhook', (req, res) => {
  try {
    console.log('Menerima payload:', req.body);

    // Menggunakan req.body langsung tanpa perlu parsing
    const { repository, pusher, head_commit } = req.body;

    if (!repository || !pusher || !head_commit) {
      console.error('Payload tidak lengkap');
      return res.status(400).send('Permintaan tidak valid. Payload tidak lengkap');
    }

    const message = `
    ${head_commit.message}
    
    Link GitHub: 
    ${head_commit.url}
    `;

    kirimPesanTelegram(message);

    res.status(200).send('Webhook diterima dengan baik.');
  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    res.status(500).send('Terjadi kesalahan dalam pemrosesan webhook');
  }
});

function kirimPesanTelegram(message) {
  try {
    const telegramApiUrl = `https://api.telegram.org/bot6603041587:AAF8qf2IWX9dzLQH0_wb7dUZ0tDk6XbIrWM/sendMessage`;
    const params = {
      chat_id: -1002062663137,
      text: message,
    };

    axios.post(telegramApiUrl, params)
      .then(response => console.log('Pesan Telegram terkirim:', response.data))
      .catch(error => console.error('Tidak dapat mengirim pesan Telegram:', error.message));
  } catch (error) {
    console.error('Terjadi kesalahan dalam mengirim pesan Telegram:', error.message);
  }
}

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

// Export express app untuk digunakan oleh PM2
module.exports = app;