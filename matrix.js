function matrix_gen(i_x, i_y)
{
    var matrix = [];
    for(var x = 0; x < i_x; x++)
    {
        matrix[x] = [];
        for(var y = 0; y < i_y; y++)
            matrix[x][y] = undefined;
    }
    return matrix;
}

function matrix_init(m, value)
{
    for(var y = 0; y < m[0].length; y++)
        for(var x = 0; x < m.length; x++)
            m[x][y] = value;
}

function matrix_to_string(m)
{
    var output_buf = '';
    for(var y = 0; y < m[0].length; y++)
    {
        for(var x = 0; x < m.length; x++)
            if(m[x][y] != undefined)
                output_buf += m[x][y] + "\t";
            else
                output_buf += "NULL" + "\t";
        output_buf += '\n';
    }
    return output_buf;
}

function matrix_print(m)
{
    console.log(matrix_to_string(m));
}
