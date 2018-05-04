var entities;
var newEntities;
var selected = 'prey';

var presets =[
    {
        num: {
            food: 5,
            pred: 0,
            prey: 1
        },
        custom: []
    },
    {
        num: {
            food: 30,
            pred: 3,
            prey: 10
        },
        custom: []
    }
]
var presetNum;
var avoidLines = true;
var chaseLines = true;
var lineMode = false;
var motionBlur = false;
var showChart = false;
var showNutrition = true;
var showPerception = false;
var slider = document.getElementById("foodSpeed");

var colors = [
    templates.food.color, templates.prey.color, templates.swarm.color,
    templates.pred.color, templates.fungus.color
];


// Misc functions



// Main p5 functions
function setup() {
    var canvas = createCanvas(window.innerWidth/2, window.innerHeight/2);
    canvas.parent('sketch-holder');
    console.log(presets[presetNum]);
    initEntities(presets[presetNum]);
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
    if (total <= 0 || total > 1200 || numDynamic === 0) {
        initEntities(presets[presetNum]);
    }

    console.log(slider.value)
    // Randomly spawn food on map
    if (random(100 - slider.value) < 1) {
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

    // // Draw pie chart
    // pieChart(entities);

    removeDead(entities);
    entities = entities.concat(newEntities);
    newEntities = [];
}

function mousePressed() {
    sprawnFood()
}

function mouseDragged() {
    sprawnFood()
}