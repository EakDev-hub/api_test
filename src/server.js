const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const moment = require('moment-timezone');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DateTime & Timezone API',
      version: '1.0.0',
      description: 'API for getting current datetime and timezone information',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/datetime/now:
 *   get:
 *     summary: Get current datetime
 *     description: Returns the current date and time in ISO format
 *     responses:
 *       200:
 *         description: Current datetime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 datetime:
 *                   type: string
 *                   example: "2026-01-05T10:30:00.000Z"
 *                 timestamp:
 *                   type: number
 *                   example: 1736073000000
 *                 formatted:
 *                   type: string
 *                   example: "January 5, 2026 10:30:00 AM"
 */
app.get('/api/datetime/now', (req, res) => {
  const now = moment();
  res.json({
    datetime: now.toISOString(),
    timestamp: now.valueOf(),
    formatted: now.format('MMMM D, YYYY h:mm:ss A')
  });
});

/**
 * @swagger
 * /api/datetime/timezone/{timezone}:
 *   get:
 *     summary: Get current datetime in specific timezone
 *     description: Returns the current date and time in the specified timezone
 *     parameters:
 *       - in: path
 *         name: timezone
 *         required: true
 *         schema:
 *           type: string
 *         description: Timezone name (e.g., America/New_York, Europe/London, Asia/Tokyo)
 *         example: America/New_York
 *     responses:
 *       200:
 *         description: Current datetime in specified timezone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 timezone:
 *                   type: string
 *                   example: "America/New_York"
 *                 datetime:
 *                   type: string
 *                   example: "2026-01-05T05:30:00-05:00"
 *                 formatted:
 *                   type: string
 *                   example: "January 5, 2026 5:30:00 AM EST"
 *                 offset:
 *                   type: string
 *                   example: "-05:00"
 *       400:
 *         description: Invalid timezone
 */
app.get('/api/datetime/timezone/:timezone', (req, res) => {
  const { timezone } = req.params;
  
  if (!moment.tz.zone(timezone)) {
    return res.status(400).json({ error: 'Invalid timezone' });
  }
  
  const now = moment.tz(timezone);
  res.json({
    timezone: timezone,
    datetime: now.format(),
    formatted: now.format('MMMM D, YYYY h:mm:ss A z'),
    offset: now.format('Z')
  });
});

/**
 * @swagger
 * /api/timezones:
 *   get:
 *     summary: Get list of all available timezones
 *     description: Returns a list of all valid timezone names
 *     responses:
 *       200:
 *         description: List of timezones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 593
 *                 timezones:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["America/New_York", "Europe/London", "Asia/Tokyo"]
 */
app.get('/api/timezones', (req, res) => {
  const timezones = moment.tz.names();
  res.json({
    count: timezones.length,
    timezones: timezones
  });
});

/**
 * @swagger
 * /api/datetime/convert:
 *   post:
 *     summary: Convert datetime between timezones
 *     description: Convert a datetime from one timezone to another
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - datetime
 *               - fromTimezone
 *               - toTimezone
 *             properties:
 *               datetime:
 *                 type: string
 *                 example: "2026-01-05 10:00:00"
 *               fromTimezone:
 *                 type: string
 *                 example: "America/New_York"
 *               toTimezone:
 *                 type: string
 *                 example: "Asia/Tokyo"
 *     responses:
 *       200:
 *         description: Converted datetime
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 original:
 *                   type: object
 *                 converted:
 *                   type: object
 *       400:
 *         description: Invalid input
 */
app.post('/api/datetime/convert', (req, res) => {
  const { datetime, fromTimezone, toTimezone } = req.body;
  
  if (!datetime || !fromTimezone || !toTimezone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (!moment.tz.zone(fromTimezone) || !moment.tz.zone(toTimezone)) {
    return res.status(400).json({ error: 'Invalid timezone' });
  }
  
  const original = moment.tz(datetime, fromTimezone);
  const converted = original.clone().tz(toTimezone);
  
  res.json({
    original: {
      timezone: fromTimezone,
      datetime: original.format(),
      formatted: original.format('MMMM D, YYYY h:mm:ss A z')
    },
    converted: {
      timezone: toTimezone,
      datetime: converted.format(),
      formatted: converted.format('MMMM D, YYYY h:mm:ss A z')
    }
  });
});

/**
 * @swagger
 * /api/calculate/add:
 *   post:
 *     summary: Add two numbers
 *     description: Returns the sum of two numbers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - a
 *               - b
 *             properties:
 *               a:
 *                 type: number
 *                 example: 10
 *               b:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Sum result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 operation:
 *                   type: string
 *                   example: "addition"
 *                 a:
 *                   type: number
 *                 b:
 *                   type: number
 *                 result:
 *                   type: number
 *                   example: 15
 */
app.post('/api/calculate/add', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  
  res.json({
    operation: 'addition',
    a,
    b,
    result: a + b
  });
});

/**
 * @swagger
 * /api/calculate/subtract:
 *   post:
 *     summary: Subtract two numbers
 *     description: Returns the difference of two numbers (a - b)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - a
 *               - b
 *             properties:
 *               a:
 *                 type: number
 *                 example: 10
 *               b:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Subtraction result
 */
app.post('/api/calculate/subtract', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  
  res.json({
    operation: 'subtraction',
    a,
    b,
    result: a - b
  });
});

/**
 * @swagger
 * /api/calculate/multiply:
 *   post:
 *     summary: Multiply two numbers
 *     description: Returns the product of two numbers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - a
 *               - b
 *             properties:
 *               a:
 *                 type: number
 *                 example: 10
 *               b:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Multiplication result
 */
app.post('/api/calculate/multiply', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  
  res.json({
    operation: 'multiplication',
    a,
    b,
    result: a * b
  });
});

/**
 * @swagger
 * /api/calculate/divide:
 *   post:
 *     summary: Divide two numbers
 *     description: Returns the quotient of two numbers (a / b)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - a
 *               - b
 *             properties:
 *               a:
 *                 type: number
 *                 example: 10
 *               b:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Division result
 *       400:
 *         description: Division by zero error
 */
app.post('/api/calculate/divide', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  
  if (b === 0) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  
  res.json({
    operation: 'division',
    a,
    b,
    result: a / b
  });
});

/**
 * @swagger
 * /api/calculate/power:
 *   post:
 *     summary: Calculate power
 *     description: Returns a raised to the power of b (a^b)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - a
 *               - b
 *             properties:
 *               a:
 *                 type: number
 *                 example: 2
 *               b:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Power result
 */
app.post('/api/calculate/power', (req, res) => {
  const { a, b } = req.body;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return res.status(400).json({ error: 'Both a and b must be numbers' });
  }
  
  res.json({
    operation: 'power',
    a,
    b,
    result: Math.pow(a, b)
  });
});

/**
 * @swagger
 * /api/calculate/sqrt:
 *   post:
 *     summary: Calculate square root
 *     description: Returns the square root of a number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *             properties:
 *               number:
 *                 type: number
 *                 example: 16
 *     responses:
 *       200:
 *         description: Square root result
 *       400:
 *         description: Negative number error
 */
app.post('/api/calculate/sqrt', (req, res) => {
  const { number } = req.body;
  
  if (typeof number !== 'number') {
    return res.status(400).json({ error: 'Number must be provided' });
  }
  
  if (number < 0) {
    return res.status(400).json({ error: 'Cannot calculate square root of negative number' });
  }
  
  res.json({
    operation: 'square root',
    number,
    result: Math.sqrt(number)
  });
});

/**
 * @swagger
 * /api/calculate/percentage:
 *   post:
 *     summary: Calculate percentage
 *     description: Calculate what percentage 'value' is of 'total'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *               - total
 *             properties:
 *               value:
 *                 type: number
 *                 example: 25
 *               total:
 *                 type: number
 *                 example: 100
 *     responses:
 *       200:
 *         description: Percentage result
 */
app.post('/api/calculate/percentage', (req, res) => {
  const { value, total } = req.body;
  
  if (typeof value !== 'number' || typeof total !== 'number') {
    return res.status(400).json({ error: 'Both value and total must be numbers' });
  }
  
  if (total === 0) {
    return res.status(400).json({ error: 'Total cannot be zero' });
  }
  
  res.json({
    operation: 'percentage',
    value,
    total,
    result: (value / total) * 100,
    formatted: `${((value / total) * 100).toFixed(2)}%`
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'DateTime & Timezone API with Calculator',
    documentation: '/api-docs'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
