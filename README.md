# DateTime & Timezone API with Calculator

A Node.js REST API for datetime, timezone operations, and calculations with Swagger documentation.

## Features

- Get current datetime
- Get datetime in specific timezone
- List all available timezones
- Convert datetime between timezones
- Mathematical calculations (add, subtract, multiply, divide, power, sqrt, percentage)
- Interactive Swagger UI documentation

## Installation

```bash
npm install
```

## Usage

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### DateTime & Timezone
- `GET /api/datetime/now` - Get current datetime
- `GET /api/datetime/timezone/:timezone` - Get datetime in specific timezone
- `GET /api/timezones` - List all available timezones
- `POST /api/datetime/convert` - Convert datetime between timezones

### Calculator
- `POST /api/calculate/add` - Add two numbers
- `POST /api/calculate/subtract` - Subtract two numbers
- `POST /api/calculate/multiply` - Multiply two numbers
- `POST /api/calculate/divide` - Divide two numbers
- `POST /api/calculate/power` - Calculate power (a^b)
- `POST /api/calculate/sqrt` - Calculate square root
- `POST /api/calculate/percentage` - Calculate percentage

## Swagger Documentation

Access the interactive API documentation at:
```
http://localhost:3005/api-docs
```

## Example Requests

### Get current datetime
```bash
curl http://localhost:3005/api/datetime/now
```

### Get datetime in specific timezone
```bash
curl http://localhost:3005/api/datetime/timezone/America/New_York
```

### Convert datetime between timezones
```bash
curl -X POST http://localhost:3005/api/datetime/convert \
  -H "Content-Type: application/json" \
  -d '{
    "datetime": "2026-01-05 10:00:00",
    "fromTimezone": "America/New_York",
    "toTimezone": "Asia/Tokyo"
  }'
```

### Add two numbers
```bash
curl -X POST http://localhost:3005/api/calculate/add \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 5}'
```

### Calculate percentage
```bash
curl -X POST http://localhost:3005/api/calculate/percentage \
  -H "Content-Type: application/json" \
  -d '{"value": 25, "total": 100}'
```
