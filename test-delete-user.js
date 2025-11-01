// Test script for DELETE user API
const apiUrl = 'https://functions.poehali.dev/0a0119c5-f173-40c2-bc49-c845a420422f';

const requestBody = {
  emails: [
    "test_farmer@example.com",
    "iliakrasnopeev@yandex.ru",
    "Iliakrasnopeev@yandex.ru",
    "ilua395@mail.ru"
  ]
};

async function deleteUsers() {
  try {
    console.log('Making DELETE request to:', apiUrl);
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    console.log('\n');

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'X-Admin-Secret': 'farmer_admin_2025_secret_key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    console.log('\n');

    const responseText = await response.text();
    console.log('Response Body (raw):', responseText);
    console.log('\n');

    try {
      const responseJson = JSON.parse(responseText);
      console.log('Response Body (JSON):', JSON.stringify(responseJson, null, 2));
    } catch (e) {
      console.log('Response is not JSON');
    }

  } catch (error) {
    console.error('Error making request:', error);
  }
}

deleteUsers();
