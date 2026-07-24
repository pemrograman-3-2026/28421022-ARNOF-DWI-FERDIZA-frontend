fetch('http://localhost:3100/user/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ username: "arnof1111", password: "password" })
})
.then(res => res.text().then(text => ({ status: res.status, body: text })))
.then(data => console.log(JSON.stringify(data, null, 2)))
.catch(err => console.error(err));
