import express from 'express';
import axios from 'axios';

const app = express();

app.get('/rank', (req, res, next) => {

});

const options = {
  method: 'GET',
  url: 'https://solved.ac/api/v3/search/user',
  params: {query: 'yeom123'},
  headers: {Accept: 'application/json'}
};

try {
  const { data } = await axios.request(options);
  console.log(data);
} catch (error) {
  console.error(error);
}


app.listen(8080);