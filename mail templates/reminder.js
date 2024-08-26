module.exports.reminder_template = (data) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your action is pending for ${data.request_type}</title>
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
        <img style="height: 90px; margin-right: 1rem;" src="https://media.licdn.com/dms/image/C4E0BAQF8-xvCiUqnqg/company-logo_200_200/0/1658771405657/daksh_electronics_pvt_ltd_logo?e=2147483647&v=beta&t=C0JmffiqSTDwQUu_MVSou36OHbefgb7HrzXMEagdLg4" />
        <h1 style="margin-bottom: 10px;">Remainder email for ${data.request_type}</h1>
      </div>
      
      <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h3 style="margin-bottom: 15px; color: #0070FF;">
        Your action is pending for ${data.request_type}
        </h3>
        
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
          <span>${data?.requested_on?.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</span>
        </div>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #ffc300; margin-bottom: 10px;">Action Required</h3>
          <a href="${
            data.request_link
          }" style="width: 40%; padding: 8px; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10%; background-color: #0070FF;">Take Action</a>
        </div>
      </div>
    </div>
  </body>
  </html>`;
};  