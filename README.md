# flow-tracker


### Basic Usage: 
```
const flowTracker = new FlowTracker(steps);
flowTracker.start();
```


### Step Options:
```
...
const stepA = {
  // options that injected directly to "request":
  url, qs, body, method, headers, proxy, json,
  
  // in case of retry step, define the time to try again:
  retryTimer,
  
  // used to distinguish what to do with the response result:
  onRespond: (response, body, {next, fail, retry}) => {
      if(!body) {
        fail(); // stop the flow.
      }
  
      if(body.id === ...) {
        next(); // continue to next step. if this is the last step - finish flow.
      } else {
        retry(); // retry this step, in order to wait to expected result.
      }
    }
  };
  
// a step can be a function that returns a step
// notice: this fucntion will be called only once, so if you "retry" this step - it will use the same data.
const stepB = () => Object.assign({}, stepA);


const steps = [stepA, stepB];
```
