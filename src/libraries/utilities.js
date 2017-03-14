export function isEmpty(obj) {
    for (let key in obj) 
        if(obj.hasOwnProperty(key))
            return false;
    return true;
}

export function formatTo12(time) {
    let t = time.split(':'),
        h = Number(t[0]);
    if (h == 0) {
        return "12:" + t[1] + " AM";
    } else if (h < 12) {
        return h + ":" + t[1] + " AM";
    } else {
        return (h - 12) + ":" + t[1] + " PM";
    }
}