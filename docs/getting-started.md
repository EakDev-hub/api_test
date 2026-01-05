# Getting Started

## Prerequisites

- Node.js 14.x or higher
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd datetime-timezone-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

## Your First API Call

### Get Current DateTime

```bash
curl http://localhost:3005/api/datetime/now
```

Response:
```json
{
  "datetime": "2026-01-05T10:30:00.000Z",
  "timestamp": 1736073000000,
  "formatted": "January 5, 2026 10:30:00 AM"
}
```

### Perform a Calculation

```bash
curl -X POST http://localhost:3005/api/calculate/add \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 5}'
```

Response:
```json
{
  "operation": "addition",
  "a": 10,
  "b": 5,
  "result": 15
}
```

## Next Steps

- Explore the [API Reference](api-reference.md) for all available endpoints
- Visit the [Swagger UI](http://localhost:3005/api-docs) for interactive documentation
- Check the OpenAPI specification in `openapi.yaml`
