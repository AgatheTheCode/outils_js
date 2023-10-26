//requête ajax
function makeRequest(url, type, action) {
    let xhr = new XMLHttpRequest();
    if (!xhr) {
        return false;
    }
    let alertContents = ""; //donne le readyState et le status de la requête
    alertContents = xhr.onreadystatechange;
    xhr.open(type, url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(action);
}
//délai
function throttle(callback, delay) {
    let lastCallTime = 0;
    let timerId;
    return function () {
        let currentTime = Date.now();
        let elapsedTime = currentTime - lastCallTime;
        if (elapsedTime < delay) {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                lastCallTime = Date.now();
                callback.apply(this, arguments);
            }, delay);
        } else {
            lastCallTime = currentTime;
            callback.apply(this, arguments);
        }
    };
}

//attendre un élément

function waitForElm(selector, parent = document) {
    return new Promise((resolve) => {
        const target = parent.querySelector(selector);
        if (target) {
            return resolve(target);
        }
        const observer = new MutationObserver((mutations) => {
            const target = parent.querySelector(selector);
            if (target) {
                resolve(target);
                observer.disconnect();
            }
        });
        observer.observe(parent, {
            childList: true,
            subtree: true,
        });
    });
}
