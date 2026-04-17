const https = require('https');

exports.handler = async (event) => {
  const station = event.queryStringParameters.station || 'stop_area:SNCF:87192039';
  const apiKey = event.queryStringParameters.key || 'de22144e-af1e-4087-8e58-82e24de2abc0';
  
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
