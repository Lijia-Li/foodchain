var entities;
var newEntities;
var selected = 'prey';

var presets = [
    {
        num: {
            food: 30,
            pred: 5,
            prey: 20
        },
        custom: []
    },
    {
        num: {
            food: 30,
            fungus: 4,
            hive: 1,
            pred: 10,
            prey: 20
        },
        custom: []
    },
    {
        num: {
            food: 30,
            prey: 20
        },
        custom: []
    },
    {
        num: {
            prey: 20
        },
        custom: [
            {
                name: 'fungus',
                x: 0,
                y: 0
            },
            {
                name: 'fungus',
                x: 100,
                y: 100
            },
            {
                name: 'fungus',
                x: 200,
                y: 200
            },
            {
                name: 'fungus',
                x: 300,
                y: 300
            },
            {
                name: 'fungus',
                x: 400,
                y: 400
            }
        ]
    }
];
var currentPreset = 0;

var avoidLines = false;
var chaseLines = false;
var lineMode = false;
var motionBlur = false;
var showChart = false;
var showNutrition = true;
var showPerception = false;

var menuVisible = true;
var sidebarOpen = false;

var colors = [
    templates.food.color, templates.prey.color, templates.swarm.color,
    templates.pred.color, templates.fungus.color
];


// Misc functions

// Draw pie chart to show ratio of each type of entity
function pieChart(entities) {
    var total = getByName(entities, [
        'food', 'prey', 'pred', 'hive', 'swarm', 'fungus'
    ]).length;
    var nums = [
        getByName(entities, 'food').length,
        getByName(entities, 'prey').length,
        getByName(entities, ['hive', 'swarm']).length,
        getByName(entities, 'pred').length,
        getByName(entities, 'fungus').length,
    ];
    var colors = [
        templates.food.color, templates.prey.color, templates.swarm.color,
        templates.pred.color, templates.fungus.color
    ];

    // Calculate angles
    var angles = [];
    for (var i = 0; i < nums.length; i++) {
        angles[i] = nums[i] / total * TWO_PI;
    }

    // Draw pie chart
    var diam = 100;
    var lastAngle = 0;
    for (var i = 0; i < angles.length; i++) {
        if (angles[i] === 0) continue;
        // Arc
        fill(colors[i].concat(191));
        noStroke();
        arc(width - 100, 100, diam, diam, lastAngle, lastAngle + angles[i]);
        lastAngle += angles[i];
    }
}


// Main p5 functions
function setup() {
    var canvas = createCanvas(window.innerWidth/2, window.innerHeight - 10);
    canvas.parent('sketch-holder');
    initEntities(presets[0]);
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
        initEntities(presets[0]);
        redrawPlot();
    }

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

    // // Draw pie chart
    // pieChart(entities);

    removeDead(entities);
    entities = entities.concat(newEntities);
    newEntities = [];
}



function mousePressed() {
    drawEntity();
}

function mouseDragged() {
    drawEntity();
}
