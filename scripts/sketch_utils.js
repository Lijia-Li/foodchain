// Set position to inside map and adjust velocity
function bounceOffEdges(e) {
    var dv = -4;
    if (e.pos.x - e.radius < 0) {
        e.pos.x = e.radius;
        e.vel.x *= dv;
    }
    if (e.pos.x + e.radius > width) {
        e.pos.x = width - e.radius;
        e.vel.x *= dv;
    }
    if (e.pos.y - e.radius < 0) {
        e.pos.y = e.radius;
        e.vel.y *= dv;
    }
    if (e.pos.y + e.radius > height) {
        e.pos.y = height - e.radius;
        e.vel.y *= dv;
    }
}

function isOutsideMap(e) {
    return isOutsideRect(e.pos.x, e.pos.y, 0, 0, width, height);
}

function drawEntity() {
    // if (sidebarOpen && mouseX < 220) return;
    // if (menuVisible && mouseX < 220 && mouseY < 30) return;
    entities.push(createEntity(mouseX, mouseY, templates[selected]));
}

function sprawnFood(){
    entities.push(createEntity(mouseX, mouseY, templates.food));
}

function initEntities(preset) {
    entities = [];
    newEntities = [];
    // Setup map from preset
    // var preset = presets[currentPreset];
    var keys = Object.keys(preset.num);
    for (var i = 0; i < keys.length; i++) {
        var template = keys[i];
        var count = preset.num[template];
        for (var j = 0; j < count; j++) {
            var x = random(width);
            var y = random(height);
            entities.push(createEntity(x, y, templates[template]));
        }
    }

    // Spawn custom entities
    for (var i = 0; i < preset.custom.length; i++) {
        var e = preset.custom[i];
        entities.push(createEntity(e.x, e.y, templates[e.name]));
    }
}

// Clear dead entities from entities array
function removeDead(entities) {
    for (var i = entities.length - 1; i >= 0; i--) {
        var e = entities[i];
        if (e.alive) continue;
        entities.splice(i, 1);
        e.onDeath(newEntities);
    }
}