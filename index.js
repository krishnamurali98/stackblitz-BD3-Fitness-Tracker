const express = require('express');
let cors = require('cors');

const { resolve } = require('path');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});
// -----------------------
let activities = [
  { activityId: 1, type: 'Running', duration: 30, caloriesBurned: 300 },
  { activityId: 2, type: 'Swimming', duration: 45, caloriesBurned: 400 },
  { activityId: 3, type: 'Cycling', duration: 60, caloriesBurned: 500 },
];

// Endpoint 1: Add an Activity
function addToActivities(
  activities,
  activityId,
  type,
  duration,
  caloriesBurned
) {
  let activitiesObj = {
    activityId: activityId,
    type: type,
    duration: duration,
    caloriesBurned: caloriesBurned,
  };

  activities.push(activitiesObj);
  return activities;
}

app.get('/activities/add', (req, res) => {
  let activityId = parseInt(req.query.activityId);
  let type = req.query.type;
  let duration = parseInt(req.query.duration);
  let caloriesBurned = parseInt(req.query.caloriesBurned);

  let result = addToActivities(
    activities,
    activityId,
    type,
    duration,
    caloriesBurned
  );
  res.json({ activities: result });
});

// Endpoint 2: Sort Activities by Duration
function sortByDuration(cond) {
  return (d1, d2) => {
    if (cond === 'low-to-high') return d1.duration - d2.duration;
    else return d2.duration - d1.duration;
  };
}

app.get('/activities/sort-by-duration', (req, res) => {
  let activities_copy = activities.slice();
  activities_copy.sort(sortByDuration('low-to-high'));
  res.json({ activities: activities_copy });
});

// Endpoint 3: Filter Activities by Type
app.get('/activities/filter-by-type', (req, res) => {
  let type = req.query.type;
  const filteredActivities = activities.filter(
    (activity) => activity.type.toLowerCase() === type.toLowerCase()
  );
  res.json({ activities: filteredActivities });
});

// Endpoint 4: Calculate Total Calories Burned
app.get('/activities/total-calories', (req, res) => {
  let sum = 0;
  for (let obj of activities) {
    sum += obj.caloriesBurned;
  }
  res.json({ totalCaloriesBurned: sum });
});

// Endpoint 5: Update Activity Duration by ID
app.get('/activities/update-duration', (req, res) => {
  let activityId = parseInt(req.query.activityId);
  let duration = parseInt(req.query.duration);

  let activity = activities.find(
    (activity) => activity.activityId === activityId
  );
  if (activity) {
    activity.duration = duration;
  }
  res.json({ activities: activities });
});

// Endpoint 6: Delete Activity by ID
app.get('/activities/delete', (req, res) => {
  let activityId = parseInt(req.query.activityId);
  activities = activities.filter(
    (activity) => activity.activityId !== activityId
  );
  res.json({ activities: activities });
});

// Endpoint 7: Delete Activities by Type
app.get('/activities/delete-by-type', (req, res) => {
  let type = req.query.type;
  activities = activities.filter(
    (activity) => activity.type.toLowerCase() !== type.toLowerCase()
  );
  res.json({ activities: activities });
});

// -----------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
