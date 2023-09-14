const DIM_X = 1920;
const DIM_Y = 1080;
const MAX_RADIUS = 10;

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

var canvas;
var pos_i;
var pos_x;
var pos_y;
var radius;
var color_index;
var red_buf;
var blue_buf;
var green_buf;
var alpha_buf;

function init(i_x, i_y)
{
    canvas = document.getElementById("canvas").getContext("2d");
    canvas.translate(DIM_X / 2, DIM_Y / 2, true);
    pos_x = i_x || 0;
    pos_y = i_y || 0;
    alpha_buf = 0;
    red_buf = 255.0;
    blue_buf = 255.0;
    green_buf = 255.0;
    radius = 0;
    pos_i = 0;
    color_index = 0;
}

function draw_node(i_x, i_y, i_color, i_radius)
{
    canvas.strokeStyle = i_color;
    canvas.fillStyle = i_color;
    canvas.beginPath();
    canvas.moveTo(i_x, i_y)
    canvas.arc(i_x, i_y, i_radius, 0, Math.PI * 2, 0);
    //canvas.arc(i_x, i_y, i_radius, 0, Math.PI * 2, 0);
    canvas.fill();
    canvas.closePath();
}

function draw_trap(i_x, i_y, i_color, i_radius)
{
    canvas.strokeStyle = i_color;
    canvas.fillStyle = i_color;
    canvas.moveTo(i_x - (Math.random() * i_radius), i_y - (Math.random() * i_radius));
    canvas.beginPath();
    canvas.lineTo(i_x + (Math.random() * i_radius), i_y - (Math.random() * i_radius));
    canvas.lineTo(i_x + (Math.random() * i_radius), i_y + (Math.random() * i_radius));
    canvas.lineTo(i_x - (Math.random() * i_radius), i_y + (Math.random() * i_radius));
    canvas.lineTo(i_x - (Math.random() * i_radius), i_y - (Math.random() * i_radius));
    //canvas.rect(i_x, i_y, i_radius, i_radius);
    canvas.fill();
    canvas.closePath();
}

function draw_square(i_x, i_y, i_color, i_radius)
{
    canvas.strokeStyle = i_color;
    canvas.fillStyle = i_color;
    canvas.beginPath();
    canvas.rect(i_x, i_y, i_radius, i_radius);
    canvas.fill();
    canvas.closePath();
}

function rand_int(max, signed)
{
    if(signed)
        return Math.floor(Math.random() * Math.floor(max)) * (Math.round(Math.random()) * 2 - 1);
    return Math.floor(Math.random() * Math.floor(max));
}

function step()
{
    pos_i += 0.001;
    pos_x =  100 * Math.sin(pos_i) * Math.sin(pos_i + pos_y) * pos_i;
    pos_y = 100 * Math.cos(pos_i) * Math.cos(pos_i + pos_x) * pos_i;

    // pos_x = 500 * Math.cos(pos_i * Math.cos(pos_i) + 2);
    // pos_y = 500 * Math.sin(pos_i * Math.sin(pos_i));

    //pos_x =  500 * Math.sin(pos_i * 2.3412);
    //pos_y = 500 * Math.cos(pos_i);

    radius += 0.001;
    //radius += 0.00005;
    //radius += 0.002;

    /*
    if(color_index < colors.length - 1)
        color_index++;
    else
        color_index = 0;
    */

    blue_buf -= 0.0004;
    red_buf -= 0.0008;
    green_buf -= 0.0006;
    alpha_buf = 1;

    // draw_trap(pos_x, pos_y, "rgba(" + red_buf + "," + green_buf + "," + blue_buf + "," + alpha_buf +")", radius);
    draw_square(pos_x, pos_y, "rgba(" + red_buf + "," + green_buf + "," + blue_buf + "," + alpha_buf +")", radius);
    //draw_square(pos_x, pos_y, colors[color_index], radius);
}

init(-DIM_X/2, 0);
draw_square(-DIM_X/2, -DIM_Y/2, "gray", DIM_X);
console.log(new Date().toTimeString());

document.addEventListener
('keypress', (event) =>{
    switch(event.keyCode)
    {
        case 32:
            for(var i = 0; i < 1000; i++)
                step();
        break;
        default:
        break;
    }
});
