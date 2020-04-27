 function drawHistogram(ctx, data, barcolor, histtype){

    var width = ctx.width;
    var height = ctx.height;

    // default size: width 300px and height 150px
    var ctx = ctx.getContext('2d')

    var tunit = width / 10;
    var barwidth = tunit;
    var barspace = 2 * tunit;

    if (histtype == 'rgb'){
        var datamax = 100;
        var label = ['R', 'G', 'B'];
        var indcolor = ['#FF0000', '#00FF00', '#152EFF'];
        barcolor = ['#c9c9c9', '#c9c9c9', '#c9c9c9'];
    }

    if (histtype == 'cmyk'){
        var datamax = 100;
        var label = ['C', 'M', 'Y', 'K'];
        var indcolor = ['#00FFFF', '#FF00FF', '#FFFF00', '#000000'];
        barcolor = ['#c9c9c9', '#c9c9c9', '#c9c9c9', '#c9c9c9'];
    }

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#e3e3e3';
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(0, 0.9 * width);
    ctx.lineTo(width, 0.9 * width);
    ctx.stroke();

    var posX = 0;
    var posY = 0;
    for (var i=0; i<data.length; i++){

        var barheight = data[i] / datamax * (0.8 * height);
        posX = i * (barspace + barwidth) + (width - data.length * barwidth - (data.length - 1) * barspace) / 2;
        posY =  height - barheight - 0.1 * height;

        ctx.fillStyle = '#f2f2f2';
        ctx.fillRect(posX,  (0.1 * height), barwidth, (0.8 * height));
        ctx.fillStyle = barcolor[i];
        ctx.fillRect(posX, posY, barwidth, barheight);

        ctx.fillStyle = '#023148';
        ctx.font = '18pt Montserrat';
        ctx.fillText(data[i], posX + 5, posY - 0.05 * height);
        ctx.font = 'bold 22pt Montserrat';
        ctx.fillText(label[i], posX + 10,  0.99 * height)

        ctx.lineWidth = 8;
        ctx.strokeStyle = indcolor[i];
        ctx.beginPath();
        ctx.moveTo(posX, 0.9 * height - barheight);
        ctx.lineTo(posX + barwidth, 0.9 * height - barheight);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = indcolor[i];
        ctx.beginPath();
        ctx.moveTo(posX + 0.5 * barwidth, 0.9 * height);
        ctx.lineTo(posX + 0.5 * barwidth, 0.9 * height - barheight);
        ctx.stroke();
    }
}