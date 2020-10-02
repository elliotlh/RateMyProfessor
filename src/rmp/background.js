const URL = "https://cors-anywhere.herokuapp.com/https://afternoon-forest-49686.herokuapp.com/";
const UNDEFINED = 'undefined';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  fetch(URL, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(resp => {
    resp.json().then(function (data) {
        if (data.length === 0) {
          console.error("No data received");
        } else {
          sendResponse(data);
        }
      })
      .catch(function (error) {
        console.error(error);
        sendResponse(UNDEFINED);
      });
  });
  return true;
});