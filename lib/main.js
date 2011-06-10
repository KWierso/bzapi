// Get bugzilla's icon image
var data = require("self").data;
var ico = data.url("index.png");

// Add a keyword search for "bug" + [bugIDnumber]
require('awesomebar').add({
  keyword: 'bug',
  onSearch: function(num, suggest) {
    if(num.length >= 4 && parseInt(num) == num) {
      getBug(num, function(bugInfo) {
        suggest({
          title: "Bug " + num + ': ' + bugInfo["status"] + ":" + 
                 bugInfo["resolution"] + " - " + bugInfo["summary"],
          description: "HELLO",
          /*description: "Creator: " + bugInfo["creator"].name + 
                       "    " + bugInfo["resolution"],*/
          icon: ico,
          url: 'https://bugzilla.mozilla.org/show_bug.cgi?id=' + num,
        }, true);
      });
    }
  },
  icon: ico
});

// Look up the bug's information via bzAPI
function getBug(num, callback) {
  require('request').Request({
    url: 'https://api-dev.bugzilla.mozilla.org/latest/bug/' + num,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    },
    onComplete: function() {
      if(this.response.json.message != "Invalid Bug ID") {
        callback(this.response.json);
      }
    }
  }).get();
}
