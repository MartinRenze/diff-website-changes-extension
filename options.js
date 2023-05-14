if (typeof browser === "undefined") {
    var browser = browser || chrome;
}

function saveOptions(e) {

    let domainsToMonitor = document.querySelector("#domainsToMonitor").value.split('\n').filter(domain => domain.trim() !== '');
    let elementToCheck = document.querySelector("#elementToCheck").value.split('\n').filter(element => element.trim() !== '');
    browser.storage.sync.set(
        {
            domainsToMonitor: domainsToMonitor,
            elementToCheck: elementToCheck,
        }
    );
    e.preventDefault();
}

function restoreOptions() {

    let gettingItem = browser.storage.sync.get('domainsToMonitor');
    gettingItem.then((res) => {
        if(res.domainsToMonitor !== undefined) {
            document.querySelector("#domainsToMonitor").value = res.domainsToMonitor.join('\n') || '';
        }
    });

    let gettingElement = browser.storage.sync.get('elementToCheck');
    gettingElement.then((res) => {
        if(res.elementToCheck !== undefined) {
            document.querySelector("#elementToCheck").value = res.elementToCheck.join('\n') || '';
        }
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);