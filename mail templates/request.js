module.exports.mail_template = (data) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.request_type}</title>
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
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div style="display: flex; justify-content: space-evenly; margin-bottom: 20px;">
        <img style="height: 90px; margin-right: 1rem;" src="https://media.licdn.com/dms/image/C4E0BAQF8-xvCiUqnqg/company-logo_200_200/0/1658771405657/daksh_electronics_pvt_ltd_logo?e=2147483647&v=beta&t=C0JmffiqSTDwQUu_MVSou36OHbefgb7HrzXMEagdLg4" />
        <h1 style="margin-bottom: 10px;">${data.request_type}</h1>
      </div>
      
      <div style="border: 1px solid #ccc; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h3 style="margin-bottom: 15px; color: #0070FF;">
          Your Approval is needed for ${data.request_type}
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
          <span style="margin-right: 2%;">Requested On:</span>
          <span>${data.requested_on}</span>
        </div>
        
        <div style="margin-top: 20px;">
          <h3 style="color: #ffc300; margin-bottom: 10px;">Action Required</h3>
          <a href="https://google.com" style="width: 40%; padding: 8px; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10%; background-color: #0070FF;">Take Action</a>
        </div>
      </div>
    </div>
  </body>
  </html>`;
};




// module.exports.mail_template= (data) => {
//     return `<!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title> ${data.request_type} </title>
//     </head>
//     <body>
//         <center>
//     <div>
//       <div style="display: flex; position: relative; justify-content: space-evenly; top: 2rem">
//         <img style="height: 90px; margin-right: 1rem;" src="https://media.licdn.com/dms/image/C4E0BAQF8-xvCiUqnqg/company-logo_200_200/0/1658771405657/daksh_electronics_pvt_ltd_logo?e=2147483647&v=beta&t=C0JmffiqSTDwQUu_MVSou36OHbefgb7HrzXMEagdLg4" />
    
//         <h1>Request</h1>
    
//       </div>
    
    
//         <div style="border: 1px ; height: 500px; width: 500px; display: flex; align-items: center; justify-content: center;"  >
//         <center><div class="card" style="width: 450px; border: 1px solid #ccc; border-radius: 8px; margin: 20px auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow: hidden; padding: 2rem 1.5rem">
//             <div class="card-header" style="padding: 12px 16px; font-size: 20px; font-weight: bold; text-align: center; width: 90%">            
//               <h3 style="margin-bottom: 15px; color: #0070FF;">
//               Your Approval is needed for ${data.request_type}
//               </h3>
//             </div>
//             <div class="card-body" style="padding: 16px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc;">
                
//                 <div style = "display:flex; margin-bottom: 1rem">
//                 <p style="margin-right: 2%;"> Requested by: </p><p>${data.requested_by} </p></div>
//                 <div style ="display:flex; margin-bottom: 1rem">
//                 <p style="margin-right: 2%;">Requested To: </p><p> ${data.requested_to}   </p></div>
//                 <div style ="display:flex; margin-bottom: 1rem">
//                 <p style="margin-right: 2%;">Requested On: </p><p>${data.requested_on}    </p></div>
//                 </div>
                
//                 <div id="approve" className="btton-class" style="padding: 20px;">
//                   <h3 style="color: #ffc300; margin-bottom: 1rem">Action Required</h3>
//                 <a href="/" style="width: 40%; padding: 8px; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10%; background-color: #0070FF;">Take Action</a>
//                 </div>
//         </div>
//         </center>
//         </div>
//     </div>
//         </center>
//     </body>
    
    
//     </html>`
// }