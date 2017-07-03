Datadog Machine Load Monitor
====

This is my project for my Datadog interview homework! The assignment was as follows:

- Collect the machine load (using “uptime” for example)
- Display in the application the key statistics as well as a history of load over the past 10 minutes in 10s intervals. We’d suggest a graphical representation using D3.js, but feel free to use another tool or representation if you prefer. Make it easy for the end-user to picture the situation!
- Make sure a user can keep the web page open and monitor the load on their machine.
- Whenever the load for the past 2 minutes exceeds 1 on average, add a message saying that “High loadgenerated an alert - load = {value}, triggered at {time}”
- Whenever the load average drops again below 1 on average for the past 2 minutes, Add another message explaining when the alert recovered.
- Make sure all messages showing when alerting thresholds are crossed remain visible on the page for historical reasons.
- Write a test for the alerting logic
- Explain how you’d improve on this application design

----------
How to Run
----
To run the program you can do the following:
```
git clone https://github.com/justinnsullivan/machine-load-monitor.git
npm install
npm start
```
To run the test script for the alerts: 
```
npm test
```
By default the app runs at http://localhost:3000/.

----------
My Approach
----
To build this tool I used React, Redux, D3, ES6 and a tiny bit of Node to configure the bash request. Instead of using uptime I decided to use `top -l 1` to receive the load statistics. I did this because I could then display the current processes along with the CPU usage. 

As suggested I used D3 to create a visualization of the load information. I used a Line Chart for the load and a Pie Chart for the CPU usage with a Datadog purple color scheme!

The alerts are displayed in a scrollable list below the tables. Red for high and green for low alerts. I tested the alerts with a script I wrote with ES6 and Chai.

----------
My Improvements
----

- I used a React/Redux [boilerplate](https://github.com/davezuko/react-redux-starter-kit) to jump start the app because I wanted to get to the core part of the app more quickly but I if I were doing this as a full project I likely would have just built the whole thing from scratch 
- When the app begins with only one data point, the line graph does not display any information until two data points have been processed so there is a delay of 10 seconds. I wasn't sure how to display one data point on a line graph so I left this for now but this could be improved
- The testing script for the alert logic could be more extensive
- I believe the React is refactored pretty well but it could maybe be refactored further
- The state is fairly complex with the statistics and alerts being grouped in together (because they are fairly dependent on each other rather than the user) but I could have divded the alerts and stats into two modules
with their own states.
 