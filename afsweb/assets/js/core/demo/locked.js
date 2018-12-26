
$(document).ready(function () {
    var uname = $.cookie('userfname');
    var userlname = $.cookie('userlname');
    var uprofiledesc = 0;
    var uprofile = "Administrator";

    $("#username").text(uname + " " + userlname);
    $("#unameno").text(uname + " " + userlname);

});