import express from 'express';
import axios from 'axios';
import cors from 'cors';
import AWS from 'aws-sdk';

import dotenv from 'dotenv';

const app = express();
app.use(cors());
dotenv.config();

const userBaekJoonIds = ['min4456e', 'beans3142', 'yeom123', 'elice100479', 'suhyunnn01', 'rereers1125']

/* DynamoDB */

AWS.config.update({
  region: "ap-northeast-2",
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const userItems = userBaekJoonIds.map(id => {
  return {
    userId: id
  }
});

const addUserToRankingTable = (item) => {
  return new Promise((resolve, reject) => {
    const userItem = {
      TableName: 'ranking',
      Item: item
    };

    docClient.put(userItem, function(err, data) {
      if (err) {
        console.error("Error", err);
        reject(err);
      } else {
        console.log("Success", data);
        resolve(data);
      }
    });
  });
}

const addMultipleUsersToRankingTable = async () => {
  try {
    const promises = userItems.map(item => addUserToRankingTable (item));
    await Promise.all(promises);
    console.log('All items have been successfully stored');
  } catch (error) {
    console.error('An error occurred while storing the items', error);
  }
};

const getAllUserIds = () => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: 'ranking',
      ProjectionExpression: 'userId' // The names of one or more attributes to retrieve
    };

    docClient.scan(params, (err, data) => {
      if (err) {
        console.error('Error', JSON.stringify(err, null, 2));
        reject(err);
      } else {
        console.log('Scan succeeded');
        const userIds = data.Items.map((item) => item.userId);
        resolve(userIds);
      }
    });
  });
};

const addUsersAndRead = async () => {
  try {
    await addMultipleUsersToRankingTable();
    const userIds = await getAllUserIds();
    console.log(userIds);
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

addUsersAndRead();

// 24시간마다 반복 실행
setInterval(addUsersAndRead, 24 * 60 * 60 * 1000);


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