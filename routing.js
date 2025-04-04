onst homeRouting = require("./home");
const productRouting = require("./product");
const logoutRouting = require("./logout");
const { STATUS_CODE } = require("../constants/statusCode");


const requestRouting = (request, response) => {
    const { url, method } = request;
    const date = new Date().toISOString(); 

    console.log(`INFO [${date}]: ${method} – ${url}`);

    
    if (url === "/") {
        return homeRouting(request, response);
    }
    if (url.startsWith("/product")) {
        return productRouting(request, response);
    }
    if (url === "/logout") {
        return logoutRouting(request, response);
    }
    if (url === "/kill") {
        console.log(`PROCESS [${date}]: logout has been initiated and the application will be closed`);
        process.exit(); 
    }

    
    console.log(`ERROR [${date}]: requested url ${url} doesn’t exist`);
    response.writeHead(STATUS_CODE.NOT_FOUND, { "Content-Type": "text/html" });
    response.end("<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>");
};

module.exports = requestRouting;
