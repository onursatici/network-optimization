u = {
  getTimeBetween: function(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)) / speed;
  },

  getJobs: function(task) {
    var jobs = [];
    jobs[0] = {
      "x": task.from.x,
      "y": task.from.y,
      "taskId": task.id,
      "type": "pickup",
      "due": task.due
    };
    jobs[1] = {
      "x": task.to.x,
      "y": task.to.y,
      "taskId": task.id,
      "type": "delivery"
    };
    return jobs;
  },
  calculateCost: function(start, end, taskJobs, courierJobs) { //TODO clean this!
    var subtOne = 0;
    var subtTwo = 0;
    if (courierJobs.length > 1 && courierJobs[start]) subtOne = this.getTimeBetween(courierJobs[start], courierJobs[start - 1]);
    if (start == end) {
      var sum = this.getTimeBetween(courierJobs[start - 1], taskJobs[0]) + this.getTimeBetween(taskJobs[0], taskJobs[1]);
      if (courierJobs.length > 1 && courierJobs[start])
        sum += this.getTimeBetween(courierJobs[start], taskJobs[1]);
      return sum - subtOne;
    }
    var sumOne = this.getTimeBetween(courierJobs[start - 1], taskJobs[0]) + this.getTimeBetween(taskJobs[0], courierJobs[start]);
    if (courierJobs[end]) subtTwo = this.getTimeBetween(courierJobs[end], courierJobs[end - 1]);
    var sumTwo = this.getTimeBetween(courierJobs[end - 1], taskJobs[1]);
    if (courierJobs[end]) sumTwo += this.getTimeBetween(taskJobs[1], courierJobs[end]);
    return sumOne + sumTwo - subtOne - subtTwo;
  }
};



function optimize() {
  while (unassignedTasks.length) {

    var cost, minCost, bestCourierId, tempArray, bestI, bestJ;
    availableCouriers = filterCouriers(unassignedTasks[0]);
    //console.log(availableCouriers);
    if(!availableCouriers.length){
      return;
    }
    bestCourierId = availableCouriers[0].id;
    tempArray = calcCostForCourier(availableCouriers[0], unassignedTasks[0]);
    minCost = tempArray[0];
    bestI = tempArray[1];
    bestJ = tempArray[2];
    if (availableCouriers.length > 1) {
      for (var j = 1; j < availableCouriers.length; j++) {
        tempArray = calcCostForCourier(availableCouriers[j], unassignedTasks[0]);
        cost = tempArray[0];
        if (cost < minCost) {
          minCost = cost;
          bestCourierId = availableCouriers[j].id;
          bestI = tempArray[1];
          bestJ = tempArray[2];
        }
      }
    }
    addTask(bestCourierId, unassignedTasks[0], bestI, bestJ);
    unassignedTasks.shift(); //TODO solve for 0 available couriers
  }
}

function filterCouriers(task) {
  var result = [];
  for (var i = 0; i < courierList.length; i++) {
    if (u.getTimeBetween(courierList[i].location, task.from) < 10000) {
      //TODO change the condition above to task.due for real-life scenarios
      result.push(courierList[i]);
    }
  }
  return result;
}

function calcCostForCourier(courier, task) {
  var cost,
    minCost,
    taskJobs = u.getJobs(task),
    bestI, bestJ;
  if (courier.jobs.length > 0) {
    minCost = u.calculateCost(1, 1, taskJobs, courier.jobs); //TODO clean this
    bestI = 1;
    bestJ = 1;
  } else {
    return [u.getTimeBetween(courier.location, task.from)/100, 0, 0]; // TODO /1000 calculation for vacant couriers
  }
  for (var i = 1; i < courier.jobs.length + 1; i++) {
    for (var j = i; j < courier.jobs.length + 1; j++) {
      cost = u.calculateCost(i, j, taskJobs, courier.jobs);
      if (cost < minCost) {
        minCost = cost;
        bestI = i;
        bestJ = j;
      }
    }
  }
  return [minCost, bestI, bestJ];
}

function addTask(courierId, task, startIndex, endIndex) {
  taskJobs = u.getJobs(task);
  for (var i = 0; i < courierList.length; i++) {
    if (courierList[i].id == courierId) {
      courierList[i].jobs.splice(startIndex, 0, taskJobs[0]);
      courierList[i].jobs.splice(endIndex + 1, 0, taskJobs[1]);
      return 1;
    }
  }
}
