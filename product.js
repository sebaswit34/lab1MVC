const fs = require("fs"); 
const STATUS_CODE = require("../constants/statusCode"); 


const renderAddProductPage = (response) => {
    response.setHeader("Content-Type", "text/html");
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Shop – Add Product</title>
        </head>
        <body>
            <h1>Add Product</h1>
            <form action="/product/add" method="POST">
                <label>Product Name: <input type="text" name="productName" required></label>
                <button type="submit">Add</button>
            </form>
        </body>
        </html>
    `;
    response.write(htmlContent);
    response.end();
};


const renderNewProductPage = (response) => {
    response.setHeader("Content-Type", "text/html");

    fs.readFile("product.txt", "utf-8", (err, data) => {
        if (err) {
            response.writeHead(STATUS_CODE.NOT_FOUND);
            response.end("<h1>Error: Could not read product file.</h1>");
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Shop – Newest Product</title>
            </head>
            <body>
                <h1>Newest Product</h1>
                <p>${data}</p>
                <a href="/">Back to Home</a>
            </body>
            </html>
        `;
        response.write(htmlContent);
        response.end();
    });
};


const addNewProduct = (request, response) => {
    let body = "";

    request.on("data", (chunk) => {
        body += chunk.toString();
    });

    request.on("end", () => {
        const parsedData = new URLSearchParams(body);
        const productName = parsedData.get("productName");

        fs.writeFile("product.txt", productName, (err) => {
            if (err) {
                response.writeHead(STATUS_CODE.NOT_FOUND);
                response.end("<h1>Error: Could not save product.</h1>");
                return;
            }

            response.writeHead(STATUS_CODE.FOUND, { Location: "/product/new" });
            response.end();
        });
    });
};


const productRouting = (request, response) => {
    if (request.url === "/product/add" && request.method === "GET") {
        return renderAddProductPage(response);
    } else if (request.url === "/product/add" && request.method === "POST") {
        return addNewProduct(request, response);
    } else if (request.url === "/product/new") {
        return renderNewProductPage(response);
    }

    console.error(`ERROR: requested url ${request.url} doesn’t exist.`);
    response.writeHead(STATUS_CODE.NOT_FOUND, { "Content-Type": "text/html" });
    response.end("<h1>404 - Not Found</h1>");
};


module.exports = productRouting;
