var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

function p(x,y) {
    return {'x':x,'y':y};
}
function get_vector_from_points(p0, p1){
    return p(p1.x-p0.x,p1.y-p0.y);
}
function unitize_vector(vector) {
    var magnitude = Math.sqrt(Math.pow(vector.x,2) + Math.pow(vector.y,2));
    return p(vector.x/magnitude,vector.y/magnitude);
}
function get_perpendicular_vector_1(vector) {
    return p(-vector.y, vector.x);
}
function get_perpendicular_vector_2(vector) {
    return p(vector.y, -vector.x);
}
var base = 30;
function draw_computed_spline(points) {
    var outPoints = getCurvePoints(points);
    var seperated_points = []
    for (var i = 0; i < outPoints.length; i += 2) {
        seperated_points.push(p(outPoints[i], outPoints[i+1]));
    }

    for (var i = 1; i < seperated_points.length-1; i++) {
        var slope = get_vector_from_points(seperated_points[i-1], seperated_points[i+1]);
        slope = unitize_vector(slope);

        var perp_slope1 = get_perpendicular_vector_1(slope);
        ctx.moveTo(seperated_points[i].x, seperated_points[i].y);
        ctx.lineTo(seperated_points[i].x + perp_slope1.x * base, seperated_points[i].y + perp_slope1.y*base);
        ctx.stroke();


    
        var perp_slope2 = get_perpendicular_vector_2(slope);
        ctx.moveTo(seperated_points[i].x, seperated_points[i].y);
        ctx.lineTo(seperated_points[i].x + perp_slope2.x * base, seperated_points[i].y + perp_slope2.y*base);
        ctx.stroke();
    }
    for(var i = 0; i < seperated_points.length; i++) {
        ctx.fillRect(seperated_points[i].x,seperated_points[i].y,1,1);
    }
}



var point_cloud = [];
document.onmousedown = function mousedown(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) { 
        x = e.pageX;
        y = e.pageY;
    } else { 
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
    } 
    x -= c.offsetLeft;
    y -= c.offsetTop;

    point_cloud.push(x);
    point_cloud.push(y);
    
    ctx.fillRect(x,y,1,1);

    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.fillStyle = 'rgba(146, 251, 155,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.fill()
    ctx.stroke();
    ctx.restore();
    
}
document.getElementById('b').onclick = function(){
    point_cloud.pop();
    draw_computed_spline(point_cloud);
    
}
