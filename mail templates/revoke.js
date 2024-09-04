const path = require("path");

module.exports.revoke_template = (data) => {
  const rootDirectory = path.resolve(__dirname, "..");
  const fullPath = path.join(rootDirectory, data.logo_url);
  console.log(fullPath);

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your ${data.request_type} is revoked.</title>
      <style>
        /* CSS resets */
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        .container {
          width: 500px;
          margin: 20px auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="display: flex; justify-content: space-evenly; margin-bottom: 20px;">
          <img style="height: 90px; margin-right: 1rem;" src="${fullPath}" />
          <h1 style="margin-bottom: 10px;">${data.request_type}</h1>
        </div>
        
        <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom: 15px; color: #f44336;">
            Your ${data.request_type} is revoked
          </h2>
          
          <div style="margin-bottom: 20px;">
            <span style="margin-right: 2%;">Requested by:</span>
            <span>${data.requested_by}</span>
          </div>
          <div style="margin-bottom: 20px;">
            <span style="margin-right: 2%;">Requested To:</span>
            <span>${data.requested_to}</span>
          </div>
          <div style="margin-bottom: 20px;">
            <span style="margin-right: 2%;">Raised On:</span>
            <span>${data.requested_on.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
          <div style="margin-bottom: 20px;">
            <span style="margin-right: 2%;">Action Taken On:</span>
            <span>${data.action_date.toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</span>
          </div>
        </div>
      </div>
    </body>
    </html>`;
};
