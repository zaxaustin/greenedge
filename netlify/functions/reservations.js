exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'GET') {
    const sailings = [
      {
        id: 'voyage-hudson-glow',
        name: 'Hudson Glow',
        date: '2024-09-01T22:30:00Z',
        capacity: 40,
        reserved: 32
      },
      {
        id: 'voyage-east-river',
        name: 'East River After Dark',
        date: '2024-09-07T00:00:00Z',
        capacity: 36,
        reserved: 28
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sailings })
    };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');

    if (!body.name || !body.email) {
      return {
        statusCode: 422,
        headers,
        body: JSON.stringify({ error: 'Name and email are required.' })
      };
    }

    const reservation = {
      id: `res-${Date.now()}`,
      name: body.name,
      email: body.email,
      voyage: body.voyage || 'Hudson Glow',
      notes: body.notes || '',
      submittedAt: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Reservation received! A crew member will confirm within 24 hours.', reservation })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
