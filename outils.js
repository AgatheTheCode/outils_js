/**
 * Attaches an event listener to the target element.
 * If the clicked element is not the target, it executes the specified action.
 *
 * @param {HTMLElement} target - The element to attach the event listener to.
 * @param {string} type - The type of event to listen for. Defaults to "click".
 * @param {Function} action - The action to execute when the event is triggered.
 * @param {HTMLElement} source - The element to listen for events on. Defaults to the document.
 * @param {number} delay - The delay in milliseconds between each execution of the action.
 * @returns {HTMLElement} - The target element.
 */
function eventHandler(target,type = "click", action, source = document, delay = 50) {
    source.addEventListener(type, throttle(function (e) {
        action(e);
    }, delay));
    return target;
}


/**
 * Makes an AJAX request to the specified URL with the given type, action, and data.
 * @param {string} url - The URL to send the request to.
 * @param {string} type - The type of request (e.g. "GET", "POST").
 * @param {string} action - The action to be performed on the server.
 * @param {object} data - Additional data to send with the request.
 * @param {function} callback - The callback function to handle the response.
 */
function makeRequest(url, type, action, data, callback) {
    let xhr = new XMLHttpRequest();
    if (!xhr) {
        return false;
    }
    xhr.open(type, url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let queryString = "action=" + action + "&";
    queryString += Object.keys(data)
        .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
    xhr.send(queryString);

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            callback(this.responseText);
        }
    };
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


/**
 * Retrieves the geolocation of the user and updates the localisation object.
 *
 * @return {Promise} A promise that resolves when the localisation object is updated, or rejects with an error message.
 */
function geoLocalisation() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async function (position) {
                let lat = position.coords.latitude;
                let long = position.coords.longitude;
                let response = await getLocalisation(lat, long).then(r => r).catch(e => console.log(e));
                if (response) {
                    let ville = response.features[0].properties.city;
                    let codePostal = response.features[0].properties.postcode;
                    localisation.ville = ville;
                    localisation.codePostal = codePostal;
                    resolve();
                } else {
                    reject("Failed to get localisation");
                }
            });
        } else {
            reject("Geolocation not supported");
        }
    });
}

/**
 * Checks if an element is overflowing.
 *
 * @param {Element} element - The element to check for overflow.
 * @return {boolean} True if the element is overflowing, false otherwise.
 */
function isOverflown(element) {
    return (element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth);
}
