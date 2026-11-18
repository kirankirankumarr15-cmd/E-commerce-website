import https from 'https';

https.get('https://e-commerce-website-three-orpin.vercel.app', (res) => {
  let body = '';
  res.on('data', (c) => (body += c));
  res.on('end', () => {
    const scripts = body.match(/assets\/index-[^"]+/g);
    console.log('LIVE ASSETS:', scripts);
    console.log('AGE:', res.headers['age'], 'DATE:', res.headers['date']);
  });
});
