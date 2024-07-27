module.exports.remainder_template = (data) => {
    return `
    
   
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> ${data.remainder_type} </title>
</head>
<body>
    <center>
    <div style="border: 1px ; height: 500px; width: 500px; display: flex; align-items: center; justify-content: center;"  >
    <center><div class="card" style="width: 350px; border: 1px solid #ccc; border-radius: 8px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; ;">
        <div class="card-header" style="background-color: #f1f1f1; padding: 12px 16px; font-size: 20px; font-weight: bold; border-bottom: 1px solid #ccc; text-align: center;">
           ${data.remainder_type} 
        </div>
        <div class="card-body" style="padding: 16px;">
            <h2 style="margin-bottom: 15px; color: #ffc300;">Take Actions or Request.</h2>
            <div style = "display:flex;">
            <p style="margin-right: 2%;"> requested-by:</p><p>${data.requested_by} </p></div>
            <div style ="display:flex;">
            <p style="margin-right: 2%;">requested-to:</p><p> ${data.requested_to}   </p></div>
            <div style ="display:flex;">
            <p style="margin-right: 2%;">requested-on:</p><p>${data.requested_on}    </p></div>
            </div>
            <textarea class="comment-box" style="width: 85%; height: 80px; ; padding: 8px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;" placeholder="Write your comment here..."></textarea>
            <div id="approve" className="btton-class" style="display: flex; padding: 5px 0px 5px 50px;"  >
            <button id="approve-button"  class="approval-button" style="width: 40%; padding: 8px; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10%; background-color: #4CAF50;">Approve</button>
            <button id="reject-button"
            class="reject-button" style="width: 40%; padding: 8px; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10%; background-color: red;">Reject</button>
            </div>
    </div>
    </center>
    </div>
    </center>
    
</body>


</html>`;
    };