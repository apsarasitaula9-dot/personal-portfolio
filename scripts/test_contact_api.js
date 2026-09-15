// scripts/test_contact_api.js
// Automated verification script for api/contact.js

const handler = require('../api/contact.js');

function mockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(key, val) {
      this.headers[key] = val;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
    end() {
      return this;
    },
  };
  return res;
}

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('\n--- Running api/contact.js automated checks ---\n');

  // Test 1: OPTIONS preflight
  {
    const req = { method: 'OPTIONS' };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 200, 'OPTIONS returns 200 with CORS headers');
  }

  // Test 2: Method Not Allowed on GET
  {
    const req = { method: 'GET' };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 405, 'GET returns 405 Method Not Allowed');
    assert(res.body.success === false, '405 body has success: false');
  }

  // Test 3: Honeypot trap
  {
    const req = {
      method: 'POST',
      body: {
        name: 'Spam Bot',
        email: 'bot@spam.com',
        message: 'Buy crypto now!',
        _gotcha: 'I am a bot',
      },
    };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 200, 'Honeypot returns 200 silently to trick spam bots');
    assert(res.body.success === true, 'Honeypot returns success: true');
  }

  // Test 4: Validation - Missing name
  {
    const req = {
      method: 'POST',
      body: {
        name: '',
        email: 'visitor@example.com',
        subject: 'web-design',
        message: 'Hello!',
      },
    };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 400, 'Empty name returns 400');
    assert(res.body.error && res.body.error.includes('name'), 'Error message mentions name');
  }

  // Test 5: Validation - Invalid email
  {
    const req = {
      method: 'POST',
      body: {
        name: 'Visitor',
        email: 'not-an-email',
        subject: 'web-design',
        message: 'Hello!',
      },
    };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 400, 'Invalid email returns 400');
    assert(res.body.error && res.body.error.includes('valid email'), 'Error message mentions valid email');
  }

  // Test 6: Validation - Empty message
  {
    const req = {
      method: 'POST',
      body: {
        name: 'Visitor',
        email: 'visitor@example.com',
        subject: 'web-design',
        message: '   ',
      },
    };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 400, 'Empty message returns 400');
  }

  // Test 7: Missing RESEND_API_KEY environment variable
  {
    const oldKey = process.env.RESEND_API_KEY;
    delete process.env.RESEND_API_KEY;

    const req = {
      method: 'POST',
      body: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'web-design',
        message: 'Can you help redesign my site?',
      },
    };
    const res = mockRes();
    await handler(req, res);
    assert(res.statusCode === 500, 'Missing RESEND_API_KEY returns 500');
    assert(res.body.error && res.body.error.includes('RESEND_API_KEY'), 'Error explicitly mentions missing RESEND_API_KEY');

    if (oldKey) process.env.RESEND_API_KEY = oldKey;
  }

  // Test 8: With RESEND_API_KEY set and simulated Resend API success
  {
    process.env.RESEND_API_KEY = 're_test_dummy_key';
    const originalFetch = global.fetch;

    global.fetch = async (url, options) => {
      const parsedBody = JSON.parse(options.body);
      assert(url === 'https://api.resend.com/emails', 'Calls Resend emails endpoint');
      assert(options.headers.Authorization === 'Bearer re_test_dummy_key', 'Passes Bearer token');
      assert(parsedBody.to[0] === 'apsarasitaula9@gmail.com', 'Sends to destination email');
      assert(parsedBody.reply_to === 'visitor@example.com', 'Sets reply_to to visitor');
      assert(parsedBody.subject.includes('Web Design & Development'), 'Uses formatted subject');

      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 'email_123456_test' }),
      };
    };

    const req = {
      method: 'POST',
      body: {
        name: 'Jane Smith',
        email: 'visitor@example.com',
        subject: 'web-design',
        message: 'I love your portfolio! Can we work together?',
      },
    };
    const res = mockRes();
    await handler(req, res);

    assert(res.statusCode === 200, 'Successful send returns 200');
    assert(res.body.success === true, 'Body contains success: true');
    assert(res.body.id === 'email_123456_test', 'Body contains email id from Resend');

    global.fetch = originalFetch;
    delete process.env.RESEND_API_KEY;
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner encountered an unhandled error:', err);
  process.exit(1);
});
