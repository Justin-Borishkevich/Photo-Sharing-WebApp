var Promise = require("Promise");
var XMLHttpRequest = require("xhr2");
const loader= new XMLHttpRequest();
/**
  * FetchModel - Fetch a model from the web server.
  *     url - string - The URL to issue the GET request.
  * Returns: a Promise that should be filled
  * with the response of the GET request parsed
  * as a JSON object and returned in the property
  * named "data" of an object.
  * If the requests has an error the promise should be
  * rejected with an object contain the properties:
  *    status:  The HTTP response status
  *    statusText:  The statusText from the xhr request
  *
*/


function fetchModel(url) {
  return new Promise(function(resolve, reject) {
    console.log(loader.status);
    loader.open('GET',url);
    console.log(loader.status);
    loader.respondType = 'json';
    console.log(loader.status);
    loader.send();
    console.log(loader.status);
    
    loader.onerror = function() {
      alert("Request failed");
    };
    console.log(url);
    console.log(loader.response);
    console.log(loader.status);
      setTimeout(() => reject({status: 501, statusText: "Not Implemented"}),0);

      return resolve({data: getResponseObject});
  });
}

fetchModel('http://localhost:3000/user/list');


//export default fetchModel;
