const https = require('https');

exports.handler = async (event) => {
  const station = event.queryStringParameters.station || 'stop_area:SNCF:87212407';
  const apiKey = event.queryStringParameters.key || '02ec645715cd69649a30eaad83c5475e216ca40d202d549478ba5d82';
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'api.sncf.com',
      path: `/v1/coverage/sncf/stop_areas/${station}/departures?count=15`,
      headers: {
        'Authorization': apiKey
      }
    };

    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: data
        });
      });
    }).on('error', () => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'Erreur API' })
      });
    });
  });
};
