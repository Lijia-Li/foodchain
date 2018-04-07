// TESTER = document.getElementById('tester');
//
// Plotly.plot( TESTER, [{
//     x: [1, 2, 3, 4, 5],
//     y: [1, 2, 4, 8, 16] }], {
//     margin: { t: 0 } } );
//
// /* Current Plotly.js version */
// console.log( Plotly.BUILD );


function rand() {
    return Math.random();
}

Plotly.plot('graph', [{
    y: [1,2,3].map(rand),
    mode: 'lines+markers',
    marker: {color: 'pink', size: 8},
    line: {width: 4}
}, {
    y: [1,2].map(rand),
    mode: 'lines+markers',
    marker: {color: 'gray', size:8},
    line: {width: 4}
}]);

var cnt = 0;
var interval = setInterval(function() {
    Plotly.extendTraces('graph', {
        y: [[rand()], [rand()]]
    }, [0, 1])

    cnt = cnt+1;
    if(cnt === 100) clearInterval(interval);
}, 500);