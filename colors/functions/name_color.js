// Copyright © 2020 Artista Studio. All right reserved.
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

function RGBtoHex(rgb) {

    let rgbToHex = function (x) {

        let y = Number(x).toString(16);
        if (y.length < 2) {
             y = "0" + y;
        }
        return y;
      };

    let hex = '#' + rgbToHex(rgb[0]) + rgbToHex(rgb[1]) + rgbToHex(rgb[2]);
    return hex;
}

function rgb2hsv(rgb) {

    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc, percentRoundFn;
    rabs = rgb[0] / 255;
    gabs = rgb[1] / 255;
    babs = rgb[2] / 255;

    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    percentRoundFn = num => Math.round(num * 100) / 100;
    
    if (diff == 0) {
        h = s = 0;
        
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    
    return [h * 360, s * 100, v * 100];
}

function int_col_proc(x) {
    
    if (x > 0.03928) {
        x = ((x + 0.055) / 1.055) ** 2.4;

    } else {
        x = x / 12.92;
    }

    return x
}

function find_lum(rgb) {

    let w_R = 0.2126;
    let w_G = 0.7152;
    let w_B = 0.0722;
    
    let lum = (w_R * int_col_proc(rgb[0] / 255) +
               w_G * int_col_proc(rgb[1] / 255) +
               w_B * int_col_proc(rgb[2] / 255));

    return lum;
}

function dist_two_rgb(rgb1, rgb2, t_weight) {

    var a = t_weight[0] * (rgb1[0] - rgb2[0]) / 255;
    var b = t_weight[1] * (rgb1[1] - rgb2[1]) / 255;
    var c = t_weight[2] * (rgb1[2] - rgb2[2]) / 255;
    var l = t_weight[3] * (find_lum(rgb1) - find_lum(rgb2));

    var dist = (a*a + b*b + c*c + l*l);

    return dist
}

function findClosestColor(my_col, li){

    let input_raw = my_col.replace(/\s/g, '').toUpperCase();
    let input = null;

    // rgb
    if (input_raw.substring(0,3) == 'RGB') {

        let rgb_match = input_raw.match(/RGB\(([0-9]+),([0-9]+),([0-9]+)\)/);
        if (rgb_match != null) {

            let r_in = rgb_match[1];
            let g_in = rgb_match[2];
            let b_in = rgb_match[3];
            
            if ((r_in >= 0) && (r_in <=255) && (g_in >= 0) && (g_in <=255) && (b_in >= 0) && (b_in <=255)) {
                input = [r_in, g_in, b_in];
            }
        }

    } else {

        if (input_raw.charAt(0) != '#') {
            input_raw = '#' + input_raw;
        }

        input = hexToRGB(input_raw); // rgb
    }

    if (input != null){

        let t_score = 1e10;
        let t_ind = 0;
        let t_weight = [1, 1, 1, 2];

        // compute similarity to each entry
        for (i = 0; i < li.length; i++) {

            let curr_hex = '#' + li[i].getElementsByTagName('a')[0].href.split('color_')[1].split('\.html')[0];
            let curr_rgb = hexToRGB(curr_hex);
            let curr_dist = dist_two_rgb(input, curr_rgb, t_weight);
            
            // set preference for Artista colors where results are equal
            if (curr_dist < t_score) {
                t_score = curr_dist;
                t_ind = i;
            }
        }

        let hex_orig = RGBtoHex(input);
        let match_perc = (1 - Math.sqrt(t_score) / Math.sqrt((t_weight[0]) **2 + (t_weight[1]) ** 2  + (t_weight[2]) **2 + (t_weight[3]) ** 2));

        return [t_ind, match_perc, hex_orig];

    } else {     

        return null;
    }    
}
