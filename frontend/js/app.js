var taskInterval = 500;
var fooArgument = 3;


var taskIntervalId = null;
var foosUid = null;
var foosStartedCounter = null;
var foosStats = [];


var applicationInit = function applicationInit() {
    foosUid = [];
    foosStartedCounter = 0;
    taskStart();
};

var taskStart = function taskStart() {
    taskIntervalId = setInterval(taskDo, taskInterval);
};

var taskStop = function taskStop() {
    clearInterval(taskIntervalId);
};

var taskDo = function taskDo() {
    foosPost(foosUid);
    fooPost();
};

var fooPost = function fooPost() {
    var url = null;

    url = '{}/{}'.replace('{}', backendUrl).replace('{}', 'foo');

    $.ajax({
        'url': url,
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'data': JSON.stringify({
            'arg': fooArgument
        }),
        'complete': fooPostCallback
    });
};

var fooPostCallback = function fooPostCallback(xhr) {
    var fooUid = null;
    if (xhr.status === 200) {
        fooUid = xhr.responseJSON['async_result'];
        ++foosStartedCounter;
        foosUid.push(fooUid);
        report();
    }
};

var foosPost = function foosPost(uids) {
    var url = null;

    url = '{}/{}'.replace('{}', backendUrl).replace('{}', 'allfoos');

    $.ajax({
        'url': url,
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'data': JSON.stringify(uids),
        'complete': foosPostCallback
    });
};

var foosPostCallback = function foosPostCallback(xhr) {
    var fooStatus = null;
    if (xhr.status === 200) {
        fooStatus = xhr.responseJSON['status'];
        for (var i = 0; i < fooStatus.length; ++i) {
            fooStatusCheck(fooStatus[i]);
        }
    }
};

var fooStatusCheck = function fooStatusCheck(fooStatus) {
    if (fooStatus['status'] === 'SUCCESS') {
        fooGet(fooStatus['uid'])
    }
};

var fooGet = function fooGet(uid) {
    var params = null,
        url = null;

    params = $.param({
        'uid': uid
    });

    url = '{}/{}?{}'.replace('{}', backendUrl).replace('{}', 'foo').replace('{}', params);

    $.ajax({
        'url': url,
        'method': 'GET',
        'headers': {
            'Content-Type': 'application/json'
        },
        'complete': fooGetCallback
    });
};

var fooGetCallback = function fooGetCallback(xhr) {
    var result = null,
        stat = null,
        removed = null;
    if (xhr.status === 200) {
        result = xhr.responseJSON['result'];
        for (var i = 0; i < foosStats.length; ++i) {
            if (result['host'] === foosStats[i]['host']) {
                stat = foosStats[i];
                break;
            }
        }
        if (stat === null) {
            stat = {
                'host': result['host'],
                'counter': 0,
                'perProcessCounters': [0, 0, 0, 0]
            };
            foosStats.push(stat);
        }
        removed = fooRemove(xhr.responseJSON['uid']);
        if (removed === true) {
            ++stat['counter'];
            ++stat['perProcessCounters'][result['process']];
            report();
        }
    }
};

var fooRemove = function fooRemove(fooUid) {
    var removed = false;
    for (var i = 0; i < foosUid.length; ++i) {
        if (foosUid[i] === fooUid) {
            foosUid.splice(i, 1);
            removed = true;
            break;
        }
    }
    return removed;
};

var report = function report() {
    var foosPendingCounter = foosUid.length;
    console.log("started", foosStartedCounter, "pending", foosPendingCounter);
    for (var i = 0; i < foosStats.length; ++i) {
        console.log(foosStats[i]['host'], foosStats[i]['counter'], "(", foosStats[i]['perProcessCounters'][0], foosStats[i]['perProcessCounters'][1], foosStats[i]['perProcessCounters'][2], foosStats[i]['perProcessCounters'][3], ")");
    }
};


document.addEventListener('DOMContentLoaded', applicationInit);


/* EOF */
