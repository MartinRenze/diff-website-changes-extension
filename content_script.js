if (typeof browser === "undefined") {
  var browser = window.browser || window.chrome;
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded");
      var url = window.location.href;
      var htmlContent = document.body.innerHTML;

      // Get the existing data for the URL, or initialize an empty array if it doesn't exist yet
      browser.storage.local.get(url, function(data) {
        var versions = data[url] || [];
        
        if (versions.length === 0 || versions[versions.length - 1] !== htmlContent) {

          // Append the new HTML content to the array of versions, keeping only the last 2 versions
          versions.push(htmlContent);
          versions = versions.slice(-2);

          // Update the data for the URL with the new versions array
          var newData = {};
          newData[url] = versions;
          browser.storage.local.set(newData, function() {
            console.log("HTML content saved to browser Storage for URL:", url);
          });
        }
      });
});