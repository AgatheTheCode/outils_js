
/**
 * Adds event listener to the target element.
 * If the clicked element is not the target, it executes the specified action.
 * @param {HTMLElement} target - The element to attach the event listener to.
 * @param {Function} action - The action to execute when the click event is triggered.
 * @param {HTMLElement} source - The element to listen for click events on. Defaults to the document.
 * @param delay delay - The delay in milliseconds between each execution of the action.
 * @returns {HTMLElement} - The target element.
 */
function eventHandler(target, action, source = document, delay = 50) {
    source.addEventListener("click", throttle(function (e) {
        action(e);
    }, delay));
    return target;
}


/**
 * Makes an AJAX request to the specified URL with the given type and action.
 * @param {string} url - The URL to send the request to.
 * @param {string} type - The type of request (e.g. "GET", "POST").
 * @param {string} action - The action to be performed on the server.
 */function makeRequest(url, type, action) {
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
/**
 * Throttles the execution of a callback function.
 * @param {function} callback - The function to be throttled.
 * @param {number} delay - The delay in milliseconds.
 * @returns {function} - The throttled function.
 */
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
/**
 * Waits for an element to be added to the DOM.
 *
 * @param {string} selector - The CSS selector of the element to wait for.
 * @param {HTMLElement} [parent=document] - The parent element to search for the target element in. Defaults to the document.
 * @return {Promise<HTMLElement>} A promise that resolves with the target element once it is added to the DOM.
 */
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
