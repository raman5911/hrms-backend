module.exports.response_template = (data) => {
    let responseMessage, responseColor;
    if (data.response === "approved") {
        responseMessage = "Request Approved Successfully";
        responseColor = "#4CAF50";
    } else if (data.response === "rejected") {
        responseMessage = "Request Rejected";
        responseColor = "#f44336";
    } else {
        responseMessage = "Response Status Unknown";
        responseColor = "#FFA500";
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.response_type}</title>
</head>
<body>
    <center>
    <div style="border: 1px solid #ccc; height: 500px; width: 500px; display: flex; align-items: center; justify-content: center;">
    <div class="card" style="width: 350px; border: 1px solid #ccc; border-radius: 8px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden;">
        <div class="card-header" style="background-color: #f1f1f1; padding: 12px 16px; font-size: 20px; font-weight: bold; border-bottom: 1px solid #ccc; text-align: center;">
           ${data.response_type} 
        </div>
        <div class="card-body" style="padding: 16px;">
           <h2 style="margin-bottom: 15px; color: ${responseColor};">${responseMessage}</h2>
            //  <p style="margin-right:80%;"> requested-by: ${data.requested_by} </p>
            //  <p style="margin-right: 80%;"> requested-to: ${data.requested_to} </p>
            //  <p style="margin-right: 80%;"> requested-on: ${data.requested_on} </p>
            <div style = "display:flex;">
            <p style="margin-right: 2%;"> requested-by:</p><p>${data.requested_by} </p></div>
            <div style ="display:flex;">
            <p style="margin-right: 2%;">requested-to:</p><p> ${data.requested_to}   </p></div>
            <div style ="display:flex;">
            <p style="margin-right: 2%;">requested-on:</p><p>${data.requested_on}    </p></div>
            
        </div>
    </div>
    </div>
    </center>
</body>
</html>`;
};