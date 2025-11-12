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
    const reviews = [
      {
        id: 'rvw-1001',
        strain: 'NYC Diesel',
        rating: 4.7,
        effects: ['Energetic', 'Creative'],
        submittedAt: '2024-08-18T15:12:00Z'
      },
      {
        id: 'rvw-1002',
        strain: 'Wedding Cake',
        rating: 4.4,
        effects: ['Relaxed', 'Happy'],
        submittedAt: '2024-08-19T22:44:00Z'
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reviews })
    };
  }

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const review = {
      id: `rvw-${Date.now()}`,
      strain: body.strain || 'Unknown',
      rating: Number(body.rating) || 0,
      effects: body.effects || [],
      submittedAt: new Date().toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Review received and queued for moderation.', review })
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};
