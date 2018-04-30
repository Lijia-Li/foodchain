var entities;
var newEntities;
var selected = 'prey';

var preset= {
    num: {
        food: 30,
        pred: 10,
        prey: 20
    },
    custom: []
    };

var avoidLines = false;
var chaseLines = false;
var lineMode = false;
var motionBlur = false;
var showChart = false;
var showNutrition = true;
var showPerception = false;

var menuVisible = true;
var sidebarOpen = false;


// Misc functions



function toggleMenu() {
    sidebarOpen = !sidebarOpen;
    var m = document.getElementById('menu');
    if (sidebarOpen && menuVisible) {
        m.style.display = 'block';
    } else {
        m.style.display = 'none';
    }
}


// Main p5 functions

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    initEntities(preset);
}

function draw() {
    // Make background slightly transparent for motion blur
    if (motionBlur) {
        background(0, 63);
    } else {
        background(0);
    }

    // Restart if there are not too many entities or too few dynamic entities
    var total = entities.length;
    var numDynamic = getByName(entities, [
        'pred', 'prey', 'swarm', 'swarmer'
    ]).length;
    if (total <= 0 || total > 1200 || numDynamic === 0) initEntities(preset);

    // Randomly spawn food on map
    if (random(5) < 1) {
        var x = random(width);
        var y = random(height);
        entities.push(createEntity(x, y, templates.food));
    }

    // Update and draw all entities
    for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        // Steering
        var visible = e.getVisible(entities);
        var names = e.toChase.concat(e.toEat).concat(e.toAvoid);
        var relevant = getByName(visible, names);
        var f;
        if (relevant.length === 0) {
            f = e.wander(newEntities);
        } else {
            f = e.steer(relevant, newEntities);
        }
        // Update
        e.applyForce(f.limit(e.accAmt));
        e.update();
        bounceOffEdges(e);
        if (isOutsideMap(e)) e.kill();
        e.hunger(newEntities);
        // Draw
        e.draw(lineMode, showPerception, showNutrition);
        // Misc
        e.onFrame(newEntities);
        // Eating
        var targets = getByName(visible, e.toEat);
        for (var j = 0; j < targets.length; j++) {
            var t = targets[j];
            if (e.contains(t.pos.x, t.pos.y)) e.onEatAttempt(t, newEntities);
        }
    }

    // Draw pie chart
    if (showChart) pieChart(entities);

    removeDead(entities);
    entities = entities.concat(newEntities);
    newEntities = [];
}


// Misc p5 functions

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initEntities(preset);
}


function mousePressed() {
    drawEntity();
}

function mouseDragged() {
    drawEntity();
}
