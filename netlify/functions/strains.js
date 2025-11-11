exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const strains = [
    {
      id: 'st-nyc-diesel',
      name: 'NYC Diesel',
      type: 'Sativa-dominant hybrid',
      thc: 22.5,
      cbd: 0.3,
      terpenes: ['Myrcene', 'Limonene', 'Caryophyllene'],
      dispensary: 'Green Goddess Manhattan',
      price: '$45 / 3.5g',
      description: 'A classic NYC strain perfect for daytime creativity and exploration.',
      effects: ['Energetic', 'Creative', 'Focused'],
      reviews: 124,
      rating: 4.6,
      trending: true,
      updatedAt: '2024-08-18T12:00:00Z'
    },
    {
      id: 'st-wedding-cake',
      name: 'Wedding Cake',
      type: 'Hybrid',
      thc: 25.2,
      cbd: 0.5,
      terpenes: ['Limonene', 'Humulene', 'Caryophyllene'],
      dispensary: 'RISE Manhattan',
      price: '$48 / 3.5g',
      description: 'Sweet vanilla flavor with relaxing effects ideal for winding down.',
      effects: ['Relaxed', 'Happy', 'Sleepy'],
      reviews: 87,
      rating: 4.4,
      trending: false,
      updatedAt: '2024-08-17T09:30:00Z'
    }
  ];

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    body: JSON.stringify({ strains })
  };
};
