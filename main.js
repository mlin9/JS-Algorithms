'use strict';

function init()
{
    var window = new Window();
/*
    var v_1 = new Vector(-1024/4,-768/4);
    var v_2 = new Vector(1024/4, -768/4);
    var v_3 = new Vector(1024/4, 768/4);
    var v_4 = new Vector(-1024/4, 768/4);
    var i_V = [v_1, v_2, v_3, v_4];
    var i_E = [[1,2,3],[0,2,3],[0,1,3],[0,1,2]];
    window.init(i_V, i_E);
*/
    window.init_rand();
    window.draw_graph();
    window.bfs_rand();
}

init();
