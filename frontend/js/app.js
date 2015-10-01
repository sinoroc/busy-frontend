
var pollingIntervalId = null;

var foosUid = null;
var foosStartedCounter = null;


var applicationInit = function applicationInit() {
    foosUid = [];
    foosStartedCounter = 0;
    fooPost();
    pollingStart();
};

var pollingStart = function pollingStart(iterations) {
    pollingIntervalId = setInterval(pollingDo, 200);
};

var pollingStop = function pollingStop() {
    clearInterval(pollingIntervalId);
};

var pollingDo = function pollingDo() {
    foosPost(foosUid);
    fooPost();
};

var fooPost = function fooPost() {
    var url = null;

    url = '{}/{}'.replace('{}', '').replace('{}', 'foo');

    $.ajax({
        'url': url,
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'data': JSON.stringify({
            'arg': 3
        }),
        'complete': fooPostCallback
    });
};

var fooPostCallback = function fooPostCallback(xhr) {
    var fooUid = null;
    fooUid = xhr.responseJSON['async_result'];
    ++foosStartedCounter;
    foosUid.push(fooUid);
    report();
};

var foosPost = function foosPost(uids) {
    var url = null;

    url = '{}/{}'.replace('{}', '').replace('{}', 'foos');

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

    fooStatus = xhr.responseJSON['status'];
    for (var i = 0; i < fooStatus.length; ++i) {
        fooStatusCheck(fooStatus[i]);
    }
};

var fooStatusCheck = function fooStatusCheck(fooStatus) {
    if (fooStatus['status'] === 'SUCCESS') {
        fooRemove(fooStatus['uid']);
        report();
    }
};

var fooRemove = function fooRemove(fooUid) {
    for (var i = 0; i < foosUid.length; ++i) {
        if (foosUid[i] === fooUid) {
            foosUid.splice(i, 1);
            break;
        }
    }
};

var report = function report() {
    var foosPendingCounter = foosUid.length;
    console.log("foosStartedCounter", foosStartedCounter, "foosPendingCounter", foosPendingCounter);
};


document.addEventListener('DOMContentLoaded', applicationInit);


/* EOF */
