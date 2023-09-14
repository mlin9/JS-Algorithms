// CONSTANTS
const MAZE_DIM_X = 10;
const MAZE_DIM_Y = 10;

const NORTH = 0;
const SOUTH = 1;
const EAST = 2;
const WEST = 3;

const I_X = 0;
const I_Y = 1;

const UNCARVED = 0;
const CARVED = 1;

// STATIC VARS
var map;
var pos_x;
var pos_y;
var breadcrumbs;

// BUFFER VARS
var random_dir;
var uncarved_buf;
var mutex_dir;
var reverse_dir;

// INITIALIZATION FUNCTION
function init_backtrack(i_x, i_y)
{
    // Blank 2D matrices
    map = matrix_gen(MAZE_DIM_X, MAZE_DIM_Y);
    matrix_init(map, UNCARVED);
    maze_grid = matrix_gen(MAZE_DIM_X, MAZE_DIM_Y);
    matrix_init(maze_grid, UNCARVED);
    // Initial pos
    pos_x = i_x;
    pos_y = i_y;
    // Breadcrumbs with initial position
    breadcrumbs = [];
}

// SCANNING FUNCTION
function uncarved(i_dir)
{
    switch(i_dir)
    {
        case NORTH:
            mutex_dir[NORTH] = true;
            if(pos_y - 1 > -1)
                return(map[pos_x][pos_y - 1] == UNCARVED);
        break;
        case SOUTH:
            mutex_dir[SOUTH] = true;
            if(pos_y + 1 < MAZE_DIM_Y)
                return(map[pos_x][pos_y + 1] == UNCARVED);
        break;
        case EAST:
            mutex_dir[EAST] = true;
            if(pos_x + 1 < MAZE_DIM_X)
                return(map[pos_x + 1][pos_y] == UNCARVED);
        break;
        case WEST:
            mutex_dir[WEST] = true;
            if(pos_x - 1 > -1)
                return(map[pos_x - 1][pos_y] == UNCARVED);
        break;
    }

    return false;
}

// STEP FUNCTION
function backtrack()
{
    // Carve current cell
    map[pos_x][pos_y] = CARVED;
    maze_grid[pos_x][pos_y] = [];
    breadcrumbs.push(pos_y);
    breadcrumbs.push(pos_x);

    // Random search for uncarved cells cardinally
    mutex_dir = [false, false, false, false];
    random_dir = Math.floor(Math.random() * 4);
    uncarved_buf = uncarved(random_dir);

    while(!uncarved_buf)
    {
        random_dir = Math.floor(Math.random() * 4);
        uncarved_buf = uncarved(random_dir);
        if(mutex_dir[NORTH] && mutex_dir[SOUTH] && mutex_dir[EAST] && mutex_dir[WEST])
        {
            breadcrumbs.pop();
            breadcrumbs.pop();
            pos_x = breadcrumbs.pop();
            pos_y = breadcrumbs.pop();
            break;
        }
    }

    // Base case
    if(breadcrumbs.length == 0)
        return true;

    // Valid uncarved direction
    if(uncarved_buf)
    {
        switch(random_dir)
        {
            case NORTH:
                pos_y = pos_y - 1;
            break;
            case SOUTH:
                pos_y = pos_y + 1;
            break;
            case EAST:
                pos_x = pos_x + 1;
            break;
            case WEST:
                pos_x = pos_x - 1;
            break;
        }
    }

    // Recurse
    return backtrack();
}

function MazeGen()
{
    init_backtrack(5,0)
    matrix_print(map);
    backtrack();
    matrix_print(map);
    matrix_print(maze_grid);
}
