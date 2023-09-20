var DIM_X;
var DIM_Y;

const LOOP_RADIUS = 15;
const VTX_RADIUS = 5;
const EDGE_WIDTH = 1;
const HEADLENGTH = 10;

const VTX_COLOR = "blue";
const EDGE_COLOR = "black";
const TRAVERSAL_COLOR = "blue";
const TRAVERSAL_COLOR_NULL = "red";
const TRAVERSAL_COLOR_ARROW = "green";
const PATH_COLOR = "blue";
const PATH_COLOR_NULL = "orange";

const FONT = "24px serif";
const FONT_SIZE = 24;

var VTX_COUNT = 10;

function Window(i_graph, i_canvas)
{
    this.canvas = i_canvas || document.getElementById("canvas").getContext("2d");
    DIM_X = document.getElementById("canvas").width;
    DIM_Y = document.getElementById("canvas").height;
    this.graph = i_graph || new Graph(VTX_COUNT, DIM_X, DIM_Y);
    this.canvas.font = FONT;
}

Window.prototype =
{
    init: function(I_V, I_E)
    {
        this.canvas.translate(DIM_X / 2, DIM_Y / 2, true);
        this.graph.init(I_V, I_E);
        VTX_COUNT = I_V.length;
    },
    init_rand: function()
    {
        this.canvas.translate(DIM_X / 2, DIM_Y / 2, true);
        this.graph.rand_init();
    },
    write: function(text, x, y, color)
    {
        this.canvas.strokeStyle = color;
        this.canvas.fillText(text, x, y);
    },
    draw_vtx: function(v, i, color)
    {
        if(v == undefined)
            return;
        this.canvas.strokeStyle = color;
        this.canvas.lineWidth = EDGE_WIDTH;
        this.canvas.beginPath();
        this.canvas.moveTo(v.x, v.y)
        this.canvas.arc(v.x, v.y, VTX_RADIUS, 0, Math.PI * 2, 0);
        this.canvas.fill();
        this.write(i, v.x * 1.1, v.y * 1.1, color);
        this.canvas.closePath();
    },
    draw_line: function(v, w, color, width)
    {
        if(v == undefined || w == undefined)
            return;
        this.canvas.strokeStyle = color;
        this.canvas.lineWidth = width;
        this.canvas.beginPath();
        this.canvas.moveTo(v.x, v.y);
        this.canvas.lineTo(w.x, w.y);
        this.canvas.stroke();
        this.canvas.closePath();
    },
    draw_arrow: function(v, w, color, width)
    {
        if(v == undefined || w == undefined)
            return;
        var dist = v.dist(w);
        var angle = w.subtract(v).to_angle();
        var tip = v.add(w.subtract(v).multiply(0.75));
        var base = v.add(w.subtract(v).multiply(0.70));
        var w_left = new Vector(base.x - HEADLENGTH * Math.cos(angle - Math.PI/6), base.y - HEADLENGTH * Math.sin(angle - Math.PI/6));
        var w_right = new Vector(base.x - HEADLENGTH * Math.cos(angle + Math.PI/6), base.y - HEADLENGTH * Math.sin(angle + Math.PI/6));
        this.draw_line(tip, w_left, color, width);
        this.draw_line(tip, w_right, color, width);
    },
    draw_graph: function()
    {
        var v_buf;
        var w_buf;
        for(var i = 0; i < this.graph.V.length; i++)
            this.draw_vtx(this.graph.V[i], i, VTX_COLOR);
        for(var i = 0; i < this.graph.V.length; i++)
        {
            v_buf = this.graph.V[i];
            for(let j of this.graph.E[i])
            {
                w_buf = this.graph.V[j];
                this.draw_line(v_buf, w_buf, EDGE_COLOR, EDGE_WIDTH);
                this.draw_arrow(v_buf, w_buf, EDGE_COLOR, EDGE_WIDTH);
            }
        }
    },
    bfs: function(V_i, target)
    {
        var graph_copy = this.graph;
        var color = TRAVERSAL_COLOR_NULL;
        var path_color = PATH_COLOR_NULL;
        var success = graph_copy.bfs(V_i, target);
        if(success)
        {
            color = TRAVERSAL_COLOR;
            path_color = PATH_COLOR;
            this.write("Algorithm discovered path", (-DIM_X / 2) + FONT_SIZE, (-DIM_Y / 2) + 3 * FONT_SIZE, color);
        }
        else
            this.write("Algorithm failed to discover path", (-DIM_X / 2) + FONT_SIZE, (-DIM_Y / 2) + 3 * FONT_SIZE, color);
        this.write("Vertex V[" + V_i + "] to vertex V[" + target + "]", (-DIM_X / 2) + FONT_SIZE, (-DIM_Y / 2) + FONT_SIZE, color);
        this.write(this.graph.bfs_breadcrumbs.toString(), (-DIM_X / 2) + FONT_SIZE, (-DIM_Y / 2) + 4 * FONT_SIZE, color);
        this.write(this.graph.bfs_visited.toString(), (-DIM_X / 2) + FONT_SIZE, (-DIM_Y / 2) + 2 * FONT_SIZE, color);


        var path = graph_copy.bfs_visited;
        for(var i = 0; i < this.graph.bfs_visited.length; i++)
        {
            this.draw_line(this.graph.V[path[i]], this.graph.V[path[i+1]], color, 3 * EDGE_WIDTH);
            this.draw_arrow(this.graph.V[path[i]], this.graph.V[path[i+1]], color, 4 * EDGE_WIDTH);
        }

        var path = graph_copy.bfs_breadcrumbs;
        for(var i = 0; i < path.length - 1; i++)
        {
            this.draw_line(this.graph.V[path[i]], this.graph.V[path[i+1]], color, 3 * EDGE_WIDTH);
            this.draw_arrow(this.graph.V[path[i]], this.graph.V[path[i+1]], color, 4 * EDGE_WIDTH);
        }
    },
    bfs_rand: function()
    {
        var diceroll = [Math.floor(Math.random() * Math.floor(VTX_COUNT)), Math.floor(Math.random() * Math.floor(VTX_COUNT))];
        while(diceroll[0] == diceroll[1])
            diceroll = [Math.floor(Math.random() * Math.floor(VTX_COUNT)), Math.floor(Math.random() * Math.floor(VTX_COUNT))];
        this.bfs(diceroll[0], diceroll[1]);
    }
};
