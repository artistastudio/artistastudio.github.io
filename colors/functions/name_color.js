function hexToRGB(h) {

    let r = 0, g = 0, b = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

    // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    
    // other formats
    } else {
        r = NaN;
    }

    if (isNaN(+r) || isNaN(+g) || isNaN(+b)) {
        return null;
    } else {
        return [+r, +g, +b]
    }    
}

function dist_two_rgb(rgb1, rgb2) {

    var a = rgb1[0] - rgb2[0];
    var b = rgb1[1] - rgb2[1];
    var c = rgb1[2] - rgb2[2];

    var dist = (a*a + b*b + c*c);

    return dist
}

function findClosestColor(my_col, li){

    let input = hexToRGB(my_col); // rgb

    let t_score = 3*256*256;
    let t_ind = 0;

    if (input != null){

        // compute similarity to each entry
        for (i = 0; i < li.length; i++) {

            let curr_hex = '#' + li[i].getElementsByTagName('a')[0].href.split('color_')[1].split('\.html')[0];
            let curr_rgb = hexToRGB(curr_hex);

            let curr_dist = dist_two_rgb(input, curr_rgb);
            
            // set preference for Artista colors where results are equal
            if (curr_dist < t_score) {
                t_score = curr_dist;
                t_ind = i;
            }
        }

        return [t_ind, t_score];

    } else {        
        return null;
    }    
}
