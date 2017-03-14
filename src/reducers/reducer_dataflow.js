import { FETCH_DATAFLOW, FETCH_PRIORITY, FETCH_METRIC_BY_PRIORITY } from '../actions/index';

const INITIAL_STATE = { all: {}, priority: [] };


var getStatus = function(data) {
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            var endMetric = data[key],
                timeString = endMetric[0].timeThreshold.split(':'),
                minuteThres = Number(timeString[0]) * 60 + Number(timeString[1]),
                threshold = new Date(), 
                timeStringIST = endMetric[0].timeThresholdIST.split(':'),
                minuteThresIST = Number(timeStringIST[0]) * + Number(timeStringIST[1]),
                thresholdIST = new Date();
            threshold.setDate(threshold.getDate() + endMetric[0].expectedDelay);
            threshold.setMinutes(threshold.getMinutes() - minuteThres);
            thresholdIST.setDate(thresholdIST.getDate() + endMetric[0].expectedDelay);
            thresholdIST.setMinutes(thresholdIST.getMinutes() - minuteThres);
            for (var i = 0; i < endMetric.length; i++) {
                var maxDate = endMetric[i].dataAvailableThrough,
                    msg = endMetric[i].errorMessage;
                if (maxDate != null && maxDate != '') {
                    var d = new Date(endMetric[i].dataAvailableThrough);
                    if (d.getHours() == 0 && d.getMinutes() == 0 && d.getSeconds() == 0) {
                        d.setHours(23);
                        d.setMinutes(59);
                    }
                    // if (key == 'SEO') {
                    //     console.log(endMetric[i].dataInfo);
                    //     console.log(d);
                    //     console.log(threshold);
                    // }
                    endMetric[i].status = d > threshold ? "UpToDate" : "Delay";
                    endMetric[i].statusIST = d > thresholdIST ? "UpToDate" : "Delay";
                }
                if (msg.length > 14) {
                    endMetric[i].status = "Error";
                    endMetric[i].statusIST = "Error";
                } else if (msg.length > 0) {
                    endMetric[i].status = "EmptyData";
                    endMetric[i].statusIST = "EmptyData";
                }
            }
        }
    }
    return data;
}

export default function(state = INITIAL_STATE, action) {
    switch(action.type) {
        case FETCH_DATAFLOW: 
            var data = getStatus(action.payload.data);
            return { all: data, priority: state.priority };
        
        case FETCH_PRIORITY:
            return { all: state.all, priority: action.payload.data };

        case FETCH_METRIC_BY_PRIORITY:
            var data = getStatus(action.payload.data);
            state.all = data;
            return { all: data, priority: state.priority };
            
        default: return state;
    }
}