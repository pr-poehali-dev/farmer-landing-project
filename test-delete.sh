#!/bin/bash

echo "Making DELETE request to delete users..."
echo ""

curl -X DELETE 'https://functions.poehali.dev/0a0119c5-f173-40c2-bc49-c845a420422f' \
  -H 'X-Admin-Secret: farmer_admin_2025_secret_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "emails": [
      "test_farmer@example.com",
      "iliakrasnopeev@yandex.ru",
      "Iliakrasnopeev@yandex.ru",
      "ilua395@mail.ru"
    ]
  }' \
  -v

echo ""
echo "Request complete."
