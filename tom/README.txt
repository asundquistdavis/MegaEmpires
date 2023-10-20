You can modify the values of the Arg1 and Arg2 headers.
Any other custom headers should trigger a CORS violation (you might want to verify that.)
Of course you can also put any JSON in the body. 

The handler for this new route (corstest) bundles everyhting together into a JSON object. In my script I just print it to the console.

All changed now. 