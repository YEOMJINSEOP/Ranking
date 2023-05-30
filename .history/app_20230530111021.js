import express from 'express';
import axios from 'axios';

const app = express();

const userBaekJoonIds = ['yeom123']

app.get('/rank', async (req, res) => {
  try {
    const usersData = await Promise.all(userBaekJoonIds.map(async (userId) => {
      const options = {
        method: 'GET',
        url: 'https://solved.ac/api/v3/search/user',
        params: {query: 'yeom123'},
        headers: {Accept: 'application/json'}
      };
  
      const { data } = await axios.request(options);
      return data;
    }))
  }
  catch (error) {
    console.error(error);
  }
});


app.listen(8080);