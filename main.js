var courierList = [];
var courierCount = 0;
var unassignedTaskCount = 0;
var speed = 1;
var unassignedTasks = [];
var from = {};
var pause = true;
var scheduledTasks = [];
var playedOnce = false;
var defactoTaskCount = 0;
var totalOptimizedDistance = 0;
var totalDefactoDistance = 0;
var activeDefactoCount = 0;

$(".pause").on("click", function(e) {
  e.preventDefault();
  pause = !pause;
  if (pause) {
    $(e.currentTarget).html("play");
  } else {
    $(e.currentTarget).html("pause");
    playedOnce = true;
  }

  if (scheduledTasks.length) {
    for (var i = 0; i < scheduledTasks.length; i++) {
      createCourierForTask(scheduledTasks[i].from, scheduledTasks[i].to, i + 1 + defactoTaskCount);
    }
    defactoTaskCount = scheduledTasks.length + 1;
  }
  scheduledTasks = [];
});
$("svg").on("dblclick", function(e) {
  if (playedOnce) return;
  courierList.push({
    "id": ++courierCount,
    "location": {
      x: e.offsetX,
      y: e.offsetY
    },
    "jobs": []
  });
  var g = svg.append("g")
    .classed("c" + courierCount, true)
    .attr("transform", "translate(" + e.offsetX + "," + e.offsetY + ")");
  var circle = g.append("circle")
    .attr("r", 13);
  var text = g.append("text")
    .attr("fill", "#FFFFFF")
    .attr("transform", "translate(-4,5)")
    .text(courierCount);
});

from.pressed = false;
$("svg").on("mousedown", function(e) {
  e.preventDefault();
  from = {
    x: e.offsetX,
    y: e.offsetY,
    pressed: true
  };
});

$("svg").on("mouseup", function(e) {
  e.preventDefault();
  to = {
    x: e.offsetX,
    y: e.offsetY
  };
  if (getDistance(from, to) > 5) { //task creation
    drawTaskLine(from, to);
    if (pause) scheduledTasks.push({
      "from": from,
      "to": to,
      "id": unassignedTaskCount + 1
    });
    else createCourierForTask(from, to, unassignedTaskCount + 1);
    $('.drag')[0].remove();
    $('.drag')[0].remove();
    unassignedTasks.push({
      "id": ++unassignedTaskCount,
      "from": from,
      "to": to,
      "duration": u.getTimeBetween(from, to),
      "due": 200
    });
    appendTaskInfo(unassignedTaskCount);
  }
  from.pressed = false;
});

$("svg").on("mousemove", function(e) {
  if (from.pressed)
    drawDragLine(e.offsetX, e.offsetY);
});


setInterval(iterate, 10); //start motion

function addRandomPath(courier) {
  var randx = Math.floor(Math.random() * 200) - 100;
  var randy = Math.floor(Math.random() * 100) - 50;
  courier.jobs.push({
    x: 480 + randx,
    y: 250 + randy
  });
}

function iterate() {
  if (pause) return;
  decreaseDue();
  if (courierList.length) {
    if (unassignedTasks.length) {
      optimize();
    }
    for (var i = 0; i < courierList.length; i++) {
      reDrawPath(courierList[i]);
      move(courierList[i]);
    }
    increaseTotalTime();
  }
}

function decreaseDue() {
  for (var k = 0; k < unassignedTasks.length; k++) {
    unassignedTasks[k].due = unassignedTasks[k].due - 1;
  }
  for (var i = 0; i < courierList.length; i++) {
    for (var j = 0; j < courierList[i].jobs.length; j++) {
      if (courierList[i].jobs[j].due) {
        courierList[i].jobs[j].due -= 1;
      }
    }
  }
}

function reDrawPath(courier) {
  if (!courier.jobs.length || (courier.jobs[0].due && courier.jobs[0].due > 1)) return;
  if (getDistance(courier.location, courier.jobs[0]) < 5) {
    updateOptimizedStatus(courier.jobs[0]);
    courier.jobs.shift();
    if ($(".l" + courier.id)[0]) $(".l" + courier.id).remove();
    if (!courier.jobs.length) return;
    drawLine(courier.location, courier.jobs[0]).classed("l" + courier.id, true);
    if (courier.jobs.length > 1)
      for (var i = 0; i < courier.jobs.length - 1; i++) {
        drawLine(courier.jobs[i], courier.jobs[i + 1]).classed("l" + courier.id, true);
      }
  }
}

function drawTaskLine(from, to, courier) {
  var foodIdArray = ['#pizza', '#chicken', '#donut'];
  var randId = Math.floor(Math.random() * 300) % 3;
  svg.append('line')
    .attr("x1", from.x)
    .attr("x2", to.x)
    .attr("y1", from.y)
    .attr("y2", to.y)
    .attr("stroke-width", 5)
    .attr("stroke", "rgb(102,192,183)")
    .attr("marker-end", "url(#triangle)")
    .attr("marker-start", "url(" + foodIdArray[randId] + ")");
  svg2.append('line')
    .attr("x1", from.x)
    .attr("x2", to.x)
    .attr("y1", from.y)
    .attr("y2", to.y)
    .attr("stroke-width", 5)
    .attr("stroke", "rgb(102,192,183)")
    .attr("marker-end", "url(#triangle)")
    .attr("marker-start", "url(" + foodIdArray[randId] + ")");
}

function drawLine(from, to, courier) {
  return svg.append('line')
    .attr("x1", from.x)
    .attr("x2", to.x)
    .attr("y1", from.y)
    .attr("y2", to.y)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "10,10")
    .attr("stroke", "rgb(153,217,207)");
}

function drawDragLine(toX, toY) {
  var line = $('.drag');
  if (line) {
    line.remove();
  }
  svg.append('line')
    .classed("drag", true)
    .attr("x1", from.x)
    .attr("y1", from.y)
    .attr("x2", toX)
    .attr("y2", toY)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "10,10")
    .attr("stroke", "rgb(0,120,108)");
  svg2.append('line')
    .classed("drag", true)
    .attr("x1", from.x)
    .attr("y1", from.y)
    .attr("x2", toX)
    .attr("y2", toY)
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "10,10")
    .attr("stroke", "rgb(0,120,108)");
}

function move(courier) {
  if (!courier.jobs.length) return 0;
  var direction = getDirection(courier.location, courier.jobs[0]);
  courier.location.x += direction.x * speed;
  courier.location.y += direction.y * speed;
  svg.select(".c" + courier.id)
    .attr("transform", "translate(" + courier.location.x + "," + courier.location.y + ")");

}

function getDirection(from, to) {
  var y = to.y - from.y;
  var x = to.x - from.x;
  var abs = getDistance(from, to);
  return {
    x: x / abs,
    y: y / abs
  };
}

function getDistance(a, b) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function createCourierForTask(from, to, id) {
  var duration = u.getTimeBetween(from, to) * 10;
  var g = svg2.append("g")
    .classed("c" + courierCount, true)
    .attr("transform", "translate(" + from.x + "," + from.y + ")");
  g.append("circle")
    .attr("r", 13);
  g.transition()
    .attr("transform", "translate(" + to.x + "," + to.y + ")")
    .duration(duration)
    .ease("linear")
    .delay(2000);
  g.transition()
    .attr("transform", "translate(" + from.x + "," + from.y + ")")
    .duration(duration)
    .ease("linear")
    .delay(2000 + duration)
    .remove();
  updateDefactoStatus(2000, duration, id);
  setTimeout(function() {
    activeDefactoCount++;
  }, 2000);
  setTimeout(function() {
    activeDefactoCount--;
  }, 2000+ duration * 2);
}

function appendTaskInfo(id) {
  $(".rows-optimized").append("<div class='row'><div class='col-sm-2 text-right'>" + id + "</div><div class='col-sm-5 text-center p" + id + "'><p style='color:red'>✘</p></div><div class='col-sm-5 text-center d" + id + "'><p style='color:red'>✘</p></div></div>");
  $(".rows-defacto").append("<div class='row'><div class='col-sm-2 text-right'>" + id + "</div><div class='col-sm-5 text-center p" + id + "'><p style='color:red'>✘</p></div><div class='col-sm-5 text-center d" + id + "'><p style='color:red'>✘</p></div></div>");
}

function updateOptimizedStatus(job) {
  if (job.type == "pickup") {
    $(".rows-optimized .p" + job.taskId).html("<p style='color:green'>✔</p>");
    return;
  }
  if (job.type == "delivery") {
    $(".rows-optimized .d" + job.taskId).html("<p style='color:green'>✔</p>");
    return;
  }
}

function updateDefactoStatus(begin, duration, id) {
  setTimeout(function() {
    $(".rows-defacto .p" + id).html("<p style='color:green'>✔</p>");
  }, begin);
  setTimeout(function() {
    $(".rows-defacto .d" + id).html("<p style='color:green'>✔</p>");
  }, begin + duration);
}

function increaseTotalTime(movingCount) {
  var movingCount = courierCount;
  for (var i = 0; i < courierList.length; i++) {
    if (!courierList[i].jobs.length) movingCount--;
    else if (getDistance(courierList[i].jobs[0], courierList[i].location) < 5 && courierList[i].jobs[0].due > 1)
      movingCount--;
  }
  var currentOptimizedDistance = parseInt($(".total-optimized-time h5").html(), 10);
  $(".total-optimized-time h5").html(currentOptimizedDistance + movingCount * speed);
  var currentDefactoDistance = parseInt($(".total-defacto-time h5").html(), 10);
  $(".total-defacto-time h5").html(currentDefactoDistance + activeDefactoCount*speed);
}
