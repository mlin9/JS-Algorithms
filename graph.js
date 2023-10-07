//  GRAPH.JS CONSTRUCTOR
function Graph(I_MAX_VTX, I_DIM_X, I_DIM_Y)
{
//  MEMBER VARS INIT
    this.MAX_VTX = I_MAX_VTX || 10;
    this.DIM_X = I_DIM_X * 0.9 || 1024;
    this.DIM_Y = I_DIM_Y * 0.9 || 768;
    this.V = [];
    this.E = [];
    this.bfs_visited = [];
    this.bfs_breadcrumbs = [];
}

//  MEMBER FUNCTIONS
Graph.prototype =
{
    rand_int: function(max, signed)
    {
        if(signed)
            return Math.floor(Math.random() * Math.floor(max)) * (Math.round(Math.random()) * 2 - 1);
        return Math.floor(Math.random() * Math.floor(max));
    },
    rand_vtx: function()
    {
        return new Vector(this.rand_int(this.DIM_X / 2, true), this.rand_int(this.DIM_Y / 2, true));
    },
    rand_init: function()
    {
        var rand_buf;
        for(var i = 0; i < this.MAX_VTX; i++)
        {
            this.V[i] = this.rand_vtx();
            this.E[i] = [];
            for(var j = 0; j < this.rand_int(this.MAX_VTX - 1, false); j++)
            {
                while(rand_buf == null || rand_buf == i || this.E[i].includes(rand_buf)) {
                    rand_buf = this.rand_int(this.MAX_VTX - 1, false);
                }
                
                this.E[i].push(rand_buf);
            }
        }
    },
    init: function(I_V, I_E)
    {
        this.V = I_V;
        this.E = I_E;
    },
    bfs: function(V_i, target)
    {
        this.bfs_visited.push(V_i);
        this.bfs_breadcrumbs.push(V_i);
        if(this.E[V_i] != undefined && this.E[V_i].length == 0 && this.bfs_visited.length == 1 && V_i != target)
            return false
        else if (V_i != target)
        {
            if(this.E[V_i] != undefined && this.E[V_i].length > 0)
                for(let neighbor of this.E[V_i])
                    if(this.E[neighbor] != undefined && this.E[neighbor].length == 0 && neighbor != target)
                        this.E.splice(neighbor, 1);
                    else if(neighbor == target)
                        return this.bfs(neighbor, target)
            if(this.E[V_i] != undefined && this.E[V_i].length > 0)
                for(let neighbor of this.E[V_i])
                    if(!this.bfs_visited.includes(neighbor))
                        return this.bfs(neighbor, target);
            else
            {
                this.E.splice(this.bfs_visited.pop(), 1);
                this.bfs_visited.pop();
                return this.bfs(this.bfs_visited.pop(), target);
            }
        }
        else if (V_i == target)
            return true;
        return false;
    }
};
