function rand() {
    return Math.random();

}

function getCount(){
    return [
        getByName(entities, 'food').length,
        getByName(entities, 'prey').length,
        getByName(entities, 'swarm').length,
        getByName(entities, 'pred').length,
        getByName(entities, 'fungus').length,
    ];
}

function totalCount(){
    return getByName(entities, [
        'food', 'prey', 'pred', 'hive', 'swarm', 'fungus'
    ]).length;
}

var layout = {
    title: "Number of Agents",
    font: {
        size: 10,
        color:'white'
    },
    width: 500,
    height: 300,
    plot_bgcolor:'black',
    paper_bgcolor:'black',
};

// todo: adjust color for the lines
Plotly.plot('graph', [{
    y: [1].map(rand),
    name: 'Food',
    mode: 'lines+markers',
    marker: {color: 'rgb(135, 211, 124)', size: 0},
    line: {width: 4}
}, {
    y: [1].map(rand),
    name: 'Prey',
    mode: 'lines+markers',
    marker: {color: 'rgb(82, 179, 217)', size:0},
    line: {width: 4}
},{
    y: [1].map(rand),
    name: 'Swarm',
    mode: 'lines+markers',
    marker: {color: 'rgb(249, 191, 59)', size:0},
    line: {width: 4}
},{
    y: [1].map(rand),
    name: 'Predator',
    mode: 'lines+markers',
    marker: {color: 'rgb(207, 0, 15)', size:0},
    line: {width: 4}
},{
    y: [1].map(rand),
    name: 'Fungus',
    mode: 'lines+markers',
    marker: {color: 'rgb(102, 51, 153)', size:0},
    line: {width: 4}
}], layout);

var cnt = 0;
var interval = setInterval(function() {
    var entitiesNums =  getCount();
    var view = {
        xaxis: {
            // type: 'date',
            range: [cnt - 30,cnt]
        }
    };

    Plotly.relayout('graph', view);
    Plotly.extendTraces('graph', {
        y: [[entitiesNums[0]], [entitiesNums[1]], [entitiesNums[2]], [entitiesNums[3]], [entitiesNums[4]]]
    }, [0, 1, 2, 3, 4]);

    cnt = cnt+1;
    if(cnt === 1000) clearInterval(interval);
}, 500);
