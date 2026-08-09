import http from 'http';

const data = JSON.stringify({
  semesterName: 'Spring 2024',
  gpa: 4.0,
  courses: [
    {
      courseCode: 'SE 111',
      courseTitle: 'Computer Fundamentals',
      credit: 3,
      grade: 'AUTO',
      gradePoint: 4
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/semesters',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    // Need a valid cookie, but let's see if we get 401 first
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, body));
});

req.on('error', e => console.error(e));
req.write(data);
req.end();
