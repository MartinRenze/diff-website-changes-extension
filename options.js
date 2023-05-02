function saveOptions(e) {

    let domainsToMonitor = document.querySelector("#domainsToMonitor").value.split('\n').filter(domain => domain.trim() !== '');
    browser.storage.sync.set(
        { domainsToMonitor: domainsToMonitor }
    );
    e.preventDefault();
}

function restoreOptions() {

    let gettingItem = browser.storage.sync.get('domainsToMonitor');
    gettingItem.then((res) => {
        document.querySelector("#domainsToMonitor").value = res.domainsToMonitor.join('\n') || '';
    });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);