const args = require('minimist')(process.argv.slice(2))
const a = parseInt(args.port)
const http = require('http')
const fs = require('fs')
// fs.readFile("home.html", (err, home) => {
//     // console.log(home.toString()); //for home.html data on console
//     // Now render the data to server
//     if (err) throw err;
//     http.createServer((req, res) => {
//         res.writeHeader(200, { "content-type": "text/html" });// writeHeader write the content as it is in html.
//         res.write(home);
//         res.end();
//     }).listen(3000);
// });

/// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let ProjectContent = ''
let HomeContent = ''
let RegistrationContent = ''
fs.readFile('home.html', (err, home) => {
  if (err) throw err
  HomeContent = home
})
fs.readFile('project.html', (err, project) => {
  if (err) throw err
  ProjectContent = project
})
fs.readFile('registration.html', (err, registration) => {
  if (err) throw err
  RegistrationContent = registration
})

http.createServer((req, res) => {
  const url = req.url
  res.writeHeader(200, { 'content-type': 'text/html' })
  switch (url) {
    case '/project':
      res.write(ProjectContent)
      res.end()
      break
    case '/registration':
      res.write(RegistrationContent)
      res.end()
      break
    default:
      res.write(HomeContent)
      res.end()
  }
}).listen(a)
