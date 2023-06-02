import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());

const userBaekJoonIds = ['min4456e', 'beans3142', 'yeom123', 'elice100479', 'suhyunnn01', 'rereers1125']

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

    const sortedUsersData = usersData.flat().sort((a, b) => b.solvedCount - a.solvedCount);
    console.log('sortedUser', sortedUsersData);
    res.send(sortedUsersData);
  }
  catch (error) {
    console.error(error);
  }
});


app.listen(80);