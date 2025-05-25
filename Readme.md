GET /api/data – Default returns 1 item

GET /api/data?limit=5 – Returns 5 items (max 10 without API key)

GET /api/data?limit=50&api_key=xxx – Returns up to 100 with valid key

GET /api/data?id=2 – Filters by ID

POST /api/data – Add new item

PUT /api/data/:id – Update item by ID

DELETE /api/data/:id – Delete item

POST /api/generate-key – Generate new API key