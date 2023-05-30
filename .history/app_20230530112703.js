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
        params: {query: userId},
        headers: {Accept: 'application/json'}
      };
  
      const { data } = await axios.request(options);

      console.log(`${data.items[0].handle} : ${data.items[0].solvedCount}`);

      const userData = data.items.map(item => ({
        userId: item.handle,
        solvedCount: item.solvedCount
      }));

      return userData;
    }))
    res.send(usersData);
  }
  catch (error) {
    console.error(error);
  }
});


app.listen(8080);