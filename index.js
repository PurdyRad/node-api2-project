// require your server and launch it here
const server = require('./api/server');

server.listen(4321, () => {
    console.log('you got a sick server running on port 4321')
});