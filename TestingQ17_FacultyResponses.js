var count = 0, new_time_display, student_test_start_time;
function alert_message_popup(checking, new_final_date, student_test_start_time) {
    if (checking == 4) {
        var alert = "Cannot schedule test when ARC is closed";
        count++;
        Swal.fire({
            text: alert,
            confirmButtonText: 'Continue'
        });
    }
    else if (checking == 5) {
        var alert = "Enter a valid time";
        count++;
        Swal.fire({
            text: alert,
            confirmButtonText: 'Continue'
        });
    }
    else if (checking == 1) {
        var alert = "Tests on Friday cannot end after 3 PM. Please click Continue and Back to change the start time and/or duration.";
        count++;
        Swal.fire({
            text: alert,
            confirmButtonText: 'Continue'
        });
    }
    else if (checking == 2) {
        var alert = "Tests on weekdays cannot end after 5 PM. Please click Continue and Back to change the start time and/or duration.";
        count++;
        Swal.fire({
            text: alert,
            confirmButtonText: 'Continue'
        });
    }
    else {
        var alert = "Exam for Course has been scheduled on " + new_final_date + ",which starts at " + student_test_start_time + " and ends at " + checking + ". Please click on Next to continue.";
        Swal.fire({
            text: alert,
            confirmButtonText: 'Next'
        });
        Qualtrics.SurveyEngine.setEmbeddedData("StudInputStartTime", student_test_start_time);
        Qualtrics.SurveyEngine.setEmbeddedData("Student_Final_End_Time", checking);
    }
}
function recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date) {
    var time_split = student_test_start_time.split(":");
    var hrs1 = parseInt(time_split[0], 10);
    var multiplying_factor;
    var min_arr = time_split[1].split(" ");
    var mins1 = parseInt(min_arr[0]);
    var ampmcheck = min_arr[1];
    if (ampmcheck == "PM" && hrs1 != 12) {
        hrs1 += 12;
    }
    if ((ampmcheck == 'PM' && ((hrs1 > 17 && hrs1 <= 23) || (hrs1 == 17 && mins1 > 0))) || (ampmcheck == 'AM' && ((hrs1 >= 1 && hrs1 < 8) || (hrs1 == 8 && mins1 <= 29) || hrs1 == 12))) {
        return 4;
    }
    if (hrs1 == 8 && mins1 != 30 && ampmcheck == 'AM') {
        return 5;
    }
    else if (ampmcheck == 'AM' && !(hrs1 > 8 && hrs1 < 12 && mins1 == 0)) { //check this condition
        return 5;
    }
    else if (ampmcheck == 'PM' && !(hrs1 >= 12 && hrs1 <= 17 && mins1 == 0)) {
        return 5;
    }
    var x2 = "Extra time for in-class assignments tests and quizzes increased to double time (2X)";
    var x15 = "Extra time for in-class assignments tests and quizzes increased to time and a half (1.5X)";
    var x25 = "Extra time for in-class assignments tests and quizzes increased to double and one half time (2.5X)";
    if (student_accoms.includes(x2)) {
        multiplying_factor = 2;
    }
    else if (student_accoms.includes(x15)) {
        multiplying_factor = 1.5;
    }
    else if (student_accoms.includes(x25)) {
        multiplying_factor = 2.5;
    }
    else {
        multiplying_factor = 1;
    }
    var new_time1 = Math.floor(new_time * multiplying_factor);
    var new_hrs = Math.floor(new_time1 / 60);
    var new_mins = new_time1 % 60;
    var new_total_hrs = new_hrs + hrs1;
    var new_total_mins = new_mins + mins1;
    var new_th1;
    if (new_total_mins >= 60) {
        new_total_mins -= 60;
        new_total_hrs += 1;
    }
    if (new_total_hrs > 12) {
        new_th1 = new_total_hrs - 12;
    }
    if (new_total_hrs <= 12) {
        new_th1 = new_total_hrs;
    }
    var ampm = (new_total_hrs >= 12) ? 'PM' : 'AM';
    var new_hrs_display = new_th1.toString().padStart(2, '0');
    var new_th1_display = new_total_hrs.toString().padStart(2, '0');
    var new_mins_display = new_total_mins.toString().padStart(2, '0');
    var new_time_display = new_hrs_display + ':' + new_mins_display + ' ' + ampm;
    var new_date_split = new Date(new_final_date);
    if (new_date_split.getUTCDay() == 5 && ((new_th1_display >= 15 && new_mins_display >= 1) || (new_th1_display > 15))) {
        return 1;
    }
    else if ((new_date_split.getUTCDay() >= 1 && new_date_split.getUTCDay() <= 4) && (new_th1_display >= 17 && new_mins_display >= 1 || (new_th1_display > 17))) {
        return 2;
    }
    else {
        return new_time_display;
    }
}
Qualtrics.SurveyEngine.addOnload(function () {
    /*Place your JavaScript here to run when the page loads*/
    var with_without_check = "${q://QID30/ChoiceGroup/SelectedChoices}";
    var checker = "Professor/instructor approves <u><strong>without</strong></u> changes";
    var out = "${q://QID57/ChoiceGroup/SelectedChoices}";
    var student_accoms = "${e://Field/StudInputAccomms}";
    var student_test_start_time = "${e://Field/Student_Another_Time_Field}";
    var new_final_date = "${e://Field/StudInputTestDate}";
    var test_date = "Total Time Allowed (minutes)";
    var check_changed_start_time = "Test start time";
    if (checker.includes(with_without_check)) {
        var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
        var checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
        alert_message_popup(checking, new_final_date, student_test_start_time);
    }
    else {
        if (out.includes(check_changed_start_time)) {
            student_test_start_time = "${q://QID57/ChoiceTextEntryValue/3}";
            var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
            var checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
            alert_message_popup(checking, new_final_date, student_test_start_time);
        }
        if (out.includes(test_date)) {
            var new_time = "${q://QID57/ChoiceTextEntryValue/2}";
            var checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
            alert_message_popup(checking, new_final_date, student_test_start_time);
        }
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/
    if (count != 0) {
        $('NextButton').disabled = true;
    }
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});