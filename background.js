// import htmldiff library
var script = document.createElement("script");
script.src = "scripts/htmldiff.min.js";
document.head.appendChild(script);

if (typeof browser === "undefined") {
    var browser = window.browser || window.chrome;
}

function htmlDiff(oldHtml, newHtml) {
    console.log("Check diff");
    let highlightedDiff = HtmlDiff.Diff.execute(oldHtml, newHtml);
    return highlightedDiff;
}

browser.action.onClicked.addListener(function (tab) {
    var url = tab.url;
    browser.storage.local.get(url, async function (data) {
        console.log("Clicked Check diff for url: " + url);

        var versions = data[url] || [];
        if (versions.length >= 2) {
            var diff = htmlDiff(versions[versions.length - 2], versions[versions.length - 1]);
            await browser.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: (diff) => {
                        document.body.outerHTML = diff;
                    },
                    args: [diff]
                }
            );
        }
    });
});

browser.storage.sync.get('domainsToMonitor').then(function (result) {
    if (result.domainsToMonitor !== undefined) {
        // Store the domains to monitor in a variable
        let domainsToMonitor = result.domainsToMonitor;
        browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if (changeInfo.status === "complete") {
                if (domainsToMonitor.some(domain => tab.url.includes(domain))) {
                    // Filter the list of tabs to match the domains

                    var url = tab.url;
                    var result = await browser.scripting.executeScript(
                        {
                            target: { tabId: tabId },
                            func: () => {
                                return document.body.outerHTML;
                            }
                        }
                    );

                    var htmlContent = result[0].result;

                    // Get the existing data for the URL, or initialize an empty array if it doesn't exist yet
                    browser.storage.local.get(url, function (data) {

                        var versions = data[url] || [];

                        if (versions.length === 0 || !doesAlmostMatch(versions[versions.length - 1], htmlContent)) {
                            // Append the new HTML content to the array of versions, keeping only the last 2 versions
                            versions.push(htmlContent);
                            versions = versions.slice(-2);

                            // Update the data for the URL with the new versions array
                            var newData = {};
                            newData[url] = versions;
                            browser.storage.local.set(newData, function () {
                                console.log("HTML content saved to browser Storage for URL:", url);
                            });
                        }
                    });
                }
            }
        });
    }
});

function doesAlmostMatch(oldHtml, newHtml) {
    var diff = HtmlDiff.Diff.execute(oldHtml, newHtml);
    if (diff === newHtml) {
        return true;
    }
    else {
        return false;
    }
};