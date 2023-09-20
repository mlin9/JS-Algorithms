var DIM_X;
var DIM_Y;

var RADIUS;
var CELL_BORDER;

var VECTOR_NW;
var VECTOR_NE;
var VECTOR_SE;
var VECTOR_SW;

var COLOR_N;
var COLOR_S;
var COLOR_E;
var COLOR_W;

const FONT = "24px serif";
const FONT_SIZE = 24;

var canvas;
var vector_buf;

function init_window()
{
    canvas = document.getElementById("canvas").getContext("2d");
    DIM_X = document.getElementById("canvas").width;
    DIM_Y = document.getElementById("canvas").height;
    canvas.font = FONT;
    MazeGen();
    RADIUS = 50;
    VECTOR_NW = new Vector(-RADIUS, -RADIUS);
    VECTOR_NE = new Vector(RADIUS, -RADIUS);
    VECTOR_SE = new Vector(RADIUS, RADIUS);
    VECTOR_SW = new Vector(-RADIUS, RADIUS);
    CELL_BORDER = 3;
}

function draw_line(v, w, color, width)
{
    if(v == undefined || w == undefined)
        return;
    canvas.strokeStyle = color;
    canvas.lineWidth = width;
    canvas.beginPath();
    canvas.moveTo(v.x, v.y);
    canvas.lineTo(w.x, w.y);
    canvas.stroke();
    canvas.closePath();
}

function draw_cell(v)
{
    draw_line(v.add(VECTOR_NW), v.add(VECTOR_NE), "black", CELL_BORDER);
    draw_line(v.add(VECTOR_NE), v.add(VECTOR_SE), "black", CELL_BORDER);
    draw_line(v.add(VECTOR_SE), v.add(VECTOR_SW), "black", CELL_BORDER);
    draw_line(v.add(VECTOR_SW), v.add(VECTOR_NW), "black", CELL_BORDER);
}

function draw_hole(v, i_dir)
{
    switch(i_dir)
    {
        case NORTH:
            draw_line(v.add(VECTOR_NW), v.add(VECTOR_NE), "white", CELL_BORDER);
        break;
        case SOUTH:
            draw_line(v.add(VECTOR_SE), v.add(VECTOR_SW), "white", CELL_BORDER);
        break;
        case EAST:
            draw_line(v.add(VECTOR_NE), v.add(VECTOR_SE), "white", CELL_BORDER);
        break;
        case WEST:
            draw_line(v.add(VECTOR_SW), v.add(VECTOR_NW), "white", CELL_BORDER);
        break;
    }
}

function draw_grid()
{
    for(var y = 0; y < MAZE_DIM_Y; y++)
        for(var x = 0; x < MAZE_DIM_X; x++)
        {
            vector_buf = new Vector(x * RADIUS + 2 * RADIUS, y * RADIUS + 2 * RADIUS);
            draw_cell(vector_buf);
            for(let dir of maze_grid[x][y])
                draw_hole(vector_buf, dir);
        }
}

function run()
{
    init_window();
    draw_grid();
}

run();
