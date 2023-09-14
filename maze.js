const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;

const UNCARVED = 0;
const CARVED = 1;

var canvas;
var cell_radius;
var cell_border;
var maze_dim_x;
var maze_dim_y;
var pos_x;
var pos_y;
var sol_x;
var sol_y;
var vector_nw;
var vector_ne;
var vector_se;
var vector_sw;
var intmap;
var solution;

var dir_found;
var mutex_dir;
var vector_buf;
var visited;

var halt;
var unsolved;

function init(i_x, i_y)
{
    canvas = document.getElementById("canvas").getContext("2d");
    cell_radius = 50;
    cell_border = 3;
    maze_dim_x = 75;
    maze_dim_y = 75;
    //maze_dim_x = 38;
    //maze_dim_y = 21;
    pos_x = i_x || 0;
    pos_y = i_y || 0;
    sol_x = maze_dim_x - 1;
    sol_y = maze_dim_y - 1;
    vector_nw = new Vector(-cell_radius, -cell_radius);
    vector_ne = new Vector(cell_radius, -cell_radius);
    vector_se = new Vector(cell_radius, cell_radius);
    vector_sw = new Vector(-cell_radius, cell_radius);
    intmap = matrix_gen(maze_dim_x, maze_dim_y);
    matrix_init(intmap, UNCARVED);
    solution = []
    visited = [];
    halt = false;
    unsolved = false;
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

function draw_node(i_x, i_y, i_color)
{
    canvas.strokeStyle = i_color;
    canvas.lineWidth = "2";
    canvas.beginPath();
    canvas.moveTo(35 + cell_radius * i_x, 35 + cell_radius * i_y)
    canvas.arc(35 + cell_radius * i_x, 35 + cell_radius * i_y, 10, 0, Math.PI * 2, 0);
    canvas.fill();
    canvas.closePath();
}

function draw_cell(v)
{
    draw_line(v.add(vector_nw), v.add(vector_ne), "black", cell_border);
    draw_line(v.add(vector_ne), v.add(vector_se), "black", cell_border);
    draw_line(v.add(vector_se), v.add(vector_sw), "black", cell_border);
    draw_line(v.add(vector_sw), v.add(vector_nw), "black", cell_border);
}

function draw_hole(v, i_dir)
{
    switch(i_dir)
    {
        case NORTH:
            draw_line(v.add(vector_nw.divide(2)), v.add(vector_ne.divide(2)), "white", cell_border + 1);
        break;
        case SOUTH:
            draw_line(v.add(vector_se.divide(2)), v.add(vector_sw.divide(2)), "white", cell_border + 1);
        break;
        case EAST:
            draw_line(v.add(vector_ne.divide(2)), v.add(vector_se.divide(2)), "white", cell_border + 1);
        break;
        case WEST:
            draw_line(v.add(vector_sw.divide(2)), v.add(vector_nw.divide(2)), "white", cell_border + 1);
        break;
    }
}

function draw_grid()
{
    for(var y = 0; y < maze_dim_y - 1; y++)
        for(var x = 0; x < maze_dim_x - 1; x++)
            {
                vector_buf = new Vector(60 + cell_radius * x, 60 + cell_radius * y);
                draw_cell(vector_buf);
            }
}

function find_uncarved(i_dir)
{
    switch(i_dir)
    {
        case NORTH:
            mutex_dir[NORTH] = true;
            if(pos_y - 1 > -1)
                return(intmap[pos_x][pos_y - 1] == UNCARVED);
        break;
        case SOUTH:
            mutex_dir[SOUTH] = true;
            if(pos_y + 1 < maze_dim_y)
                return(intmap[pos_x][pos_y + 1] == UNCARVED);
        break;
        case EAST:
            mutex_dir[EAST] = true;
            if(pos_x + 1 < maze_dim_x)
                return(intmap[pos_x + 1][pos_y] == UNCARVED);
        break;
        case WEST:
            mutex_dir[WEST] = true;
            if(pos_x - 1 > -1)
                return(intmap[pos_x - 1][pos_y] == UNCARVED);
        break;
    }
    return false;
}

function backtrack()
{
    intmap[pos_x][pos_y] = CARVED;
    visited.push(pos_y);
    visited.push(pos_x);

    if(pos_x == sol_x && pos_y == sol_y)
    {
        solution = visited.slice(0);
    }

    mutex_dir = [false, false, false, false];
    random_dir = Math.floor(Math.random() * 4);
    dir_found = find_uncarved(random_dir);

    while(!dir_found)
    {
        random_dir = Math.floor(Math.random() * 4);
        dir_found = find_uncarved(random_dir);
        if(mutex_dir[NORTH] && mutex_dir[SOUTH] && mutex_dir[EAST] && mutex_dir[WEST])
        {
            visited.pop();
            visited.pop();
            pos_x = visited.pop();
            pos_y = visited.pop();
            break;
        }
    }

    if(dir_found)
    {
        vector_buf = new Vector(35 + cell_radius * pos_x, 35 + cell_radius * pos_y);
        switch(random_dir)
        {
            case NORTH:
                draw_hole(vector_buf, NORTH);
                pos_y = pos_y - 1;
            break;
            case SOUTH:
                draw_hole(vector_buf, SOUTH);
                pos_y = pos_y + 1;
            break;
            case EAST:
                draw_hole(vector_buf, EAST);
                pos_x = pos_x + 1;
            break;
            case WEST:
                draw_hole(vector_buf, WEST);
                pos_x = pos_x - 1;
            break;
        }
    }

    if(visited.length == 0)
        return true;

    return false;
    //return backtrack();
}

function solve()
{
    if(pos_x == 0 && pos_y == 0)
    {
        pos_x = solution.pop();
        pos_y = solution.pop();
        return;
    }
    else {
        var vector_i = new Vector(pos_x * cell_radius + 35, pos_y * cell_radius + 35);
        pos_x = solution.pop();
        pos_y = solution.pop();
        var vector_f = new Vector(pos_x * cell_radius + 35, pos_y * cell_radius + 35);

        draw_line(vector_i, vector_f, "blue", cell_border * 4);
    }
}

function run()
{
    init(0,0);
    draw_node(pos_x, pos_y, "black");
    draw_node(sol_x, sol_y, "black");
    draw_grid();
}

run();


document.addEventListener
('keypress', (event) =>{
    switch(event.keyCode)
    {
        case 32:
            if(!halt)
                for(var i = 0; i < 30; i++)
                    halt = backtrack();
        break;
        case 101:
            for(var i = 0; i < 5; i++)
                solve();
        break;
        default:
        break;
    }
});
