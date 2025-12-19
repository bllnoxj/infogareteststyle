const https = require('https');

exports.handler = async (event) => {
  const station = event.queryStringParameters.station || 'stop_area:SNCF:87212407';
  const clientId = 'a5e9fa79d1014e67919fd6f4f91269f5';
  const clientSecret = '75238a1e08824fc9a5f2dce357a9683c';
  
  // Étape 1 : Obtenir le token
  return new Promise((resolve) => {
    const authString = Buffer.from(clientId + ':' + clientSecret).toString('base64');
    
    const tokenOptions = {
      hostname: 'api.sncf.com',
      path: '/v1/token',
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + authString,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const tokenReq = https.request(tokenOptions, (tokenRes) => {
      let tokenData = '';
      
      tokenRes.on('data', (chunk) => {
        tokenData += chunk;
      });
      
      tokenRes.on('end', () => {
        try {
          const tokenJson = JSON.parse(tokenData);
          const accessToken = tokenJson.access_token;
          
          // Étape 2 : Utiliser le token pour récupérer les trains
          const dataOptions = {
            hostname: 'api.sncf.com',
            path: `/v1/coverage/sncf/stop_areas/${station}/departures?count=15`,
            headers: {
              'Authorization': 'Bearer ' + accessToken
            }
          };

          https.get(dataOptions, (dataRes) => {
            let data = '';
            
            dataRes.on('data', (chunk) => {
              data += chunk;
            });
            
            dataRes.on('end', () => {
              resolve({
                statusCode: 200,
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                },
                body: data
              });
            });
          });
          
        } catch (e) {
          resolve({
            statusCode: 500,
            body: JSON.stringify({ error: 'Erreur token' })
          });
        }
      });
    });

    tokenReq.on('error', () => {
      resolve({
        statusCode: 500,
        body: JSON.stringify({ error: 'Erreur auth' })
      });
    });

    tokenReq.write('grant_type=client_credentials');
    tokenReq.end();
  });
};
