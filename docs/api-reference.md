# API Reference

## DateTime Endpoints

### GET /api/datetime/now
Get the current datetime in ISO format.

**Response:**
```json
{
  "datetime": "2026-01-05T10:30:00.000Z",
  "timestamp": 1736073000000,
  "formatted": "January 5, 2026 10:30:00 AM"
}
```

### GET /api/datetime/timezone/:timezone
Get current datetime in a specific timezone.

**Parameters:**
- `timezone` (path) - Timezone name (e.g., America/New_York)

**Response:**
```json
{
  "timezone": "America/New_York",
  "datetime": "2026-01-05T05:30:00-05:00",
  "formatted": "January 5, 2026 5:30:00 AM EST",
  "offset": "-05:00"
}
```

### GET /api/timezones
Get list of all available timezones.

**Response:**
```json
{
  "count": 593,
  "timezones": ["America/New_York", "Europe/London", "Asia/Tokyo", "..."]
}
```

### POST /api/datetime/convert
Convert datetime between timezones.

**Request Body:**
```json
{
  "datetime": "2026-01-05 10:00:00",
  "fromTimezone": "America/New_York",
  "toTimezone": "Asia/Tokyo"
}
```

## Calculator Endpoints

### POST /api/calculate/add
Add two numbers.

**Request Body:**
```json
{
  "a": 10,
  "b": 5
}
```

**Response:**
```json
{
  "operation": "addition",
  "a": 10,
  "b": 5,
  "result": 15
}
```

### POST /api/calculate/subtract
Subtract two numbers (a - b).

### POST /api/calculate/multiply
Multiply two numbers.

### POST /api/calculate/divide
Divide two numbers (a / b).

### POST /api/calculate/power
Calculate power (a^b).

### POST /api/calculate/sqrt
Calculate square root.

**Request Body:**
```json
{
  "number": 16
}
```

### POST /api/calculate/percentage
Calculate percentage.

**Request Body:**
```json
{
  "value": 25,
  "total": 100
}
```

**Response:**
```json
{
  "operation": "percentage",
  "value": 25,
  "total": 100,
  "result": 25,
  "formatted": "25.00%"
}
```
