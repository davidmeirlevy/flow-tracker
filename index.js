const request = require('request');

class FlowTracker {

    constructor(steps) {
        this._steps = steps;
        this._currentStepIndex = 0;
    }

    start() {
        if (this._steps && this._steps.length) {
            return this.continue();
        }
    }

    continue() {
        const step = this._steps[this._currentStepIndex];

        if (!step) {
            return Promise.resolve({ finished: true });
        }

        return this.runStep(step).then(() => {
            this._currentStepIndex++;
            return this.continue();
        });
    }

    runStep(step) {
        const stepData = (typeof step === 'function') ? step() : step;
        return this._runStep(stepData);
    }

    _runStep(stepData) {
        return this.makeRequest(stepData).then(({ response, body }) => {
            return new Promise((resolve, reject) => {
                stepData.onRespond(response, body, {
                    next: resolve,
                    fail: reject,
                    retry: () => setTimeout(() => {
                        this._runStep(stepData).then(resolve, reject);
                    }, stepData.retryTimer || 2000)
                });
            });
        });
    }

    makeRequest({ method, url, headers, qs, body, proxy }) {
        return new Promise((resolve, reject) => {
            request({
                url,
                headers,
                qs,
                body,
                proxy,
                method: method || 'GET'
            }, (err, response, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ response, body });
                }
            });
        });
    }

}

module.exports = FlowTracker;
