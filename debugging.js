var count = 0, count1 = 0, new_time_display, student_test_start_time;
function date_validator(date_modified) {
    var date_1 = date_modified.split(" ").join("");
    var today = new Date();
    var darr = date_1.split("/");
    if (darr.length == 3) {
        var dd = String(today.getDate());
        var mm = String(today.getMonth() + 1);
        var y1 = today.getFullYear();
        var yr = parseInt(darr[2]);
        var mnth = parseInt(darr[0]) - 1;
        var dy = parseInt(darr[1]);
        var dt = new Date(yr, mnth, dy);
        if (dt.getUTCMonth() != mnth || dt.getUTCFullYear() != yr || dt.getUTCDate() != dy) {
            alert("Please enter a valid date. Click on OK to modify the date.");
            count1 = 404;
            $('NextButton').disabled = true;
        }
        else if (dt.getUTCDay() == 6 || dt.getUTCDay() == 0) {
            alert("Tests may not be scheduled on weekends, please enter another date to continue. Click on OK to modify the date.");
            count1 = 404;
            $('NextButton').disabled = true;
            return count1;
        }
        else if ((yr < y1) || (mnth + 1 < mm) || (mnth + 1 == mm && dy < dd) || (mnth + 1 > mm && yr < y1)) {
            alert("Tests cannot be scheduled in the past. Click on OK to modify the date.");
            count1 = 404;
            $('NextButton').disabled = true;
            return count1;
        }
        else if ((mnth + 1 == 8 && dy >= 10 && yr >= y1) || (mnth + 1 >= 9 && yr == y1) || (yr > y1)) {
            alert("Please select a valid date within the semester to continue. Click on OK to modify the date.");
            count1 = 404;
            $('NextButton').disabled = true;
            return count1;
        }
        else if ((mnth + 1 == 7 && dy == 4) || (mnth + 1 == 6 && dy == 19) || (mnth + 1 == 5 && dy == 29)) {
            alert("The university is closed on the selected date. Please choose another date. Click on OK to modify the date.");
            count1 = 404;
            $('NextButton').disabled = true;
            return count1;
        }
        else {
            return date_1;
        }
    }
    else {
        alert("Please enter a valid date");
        count++;
    }
}
function counter(alert) {
    Swal.fire({
        text: alert,
        confirmButtonText: 'Continue'
    });
}
function alert_message_popup(checking, new_final_date, student_test_start_time) {
    if (checking == 4) {
        var alert = "Cannot schedule test when ARC is closed";
        count++;
        counter(alert);
    }
    else if (checking == 5) {
        var alert = "With the exception of 8:30 AM, all other tests must start on the hour (for example 9:00 AM, 10:00 AM, 3:00 PM etc.). ";
        count++;
        counter(alert);
    }
    else if (checking == 1) {
        var alert = "Tests on Friday cannot end after 3 PM. Please click Continue and Back to change the start time.";
        count++;
        counter(alert);
    }
    else if (checking == 2) {
        var alert = "Tests on weekdays cannot end after 5 PM. Please click Continue and Back to change the start time.";
        count++;
        counter(alert);
    }
    else {
        var alert = "Exam has been scheduled on " + new_final_date + ",which starts at " + student_test_start_time + " and ends at " + checking + ". Please click on Continue to continue.";
        counter(alert);
        Qualtrics.SurveyEngine.setEmbeddedData("StudInputStartTime", student_test_start_time);
        Qualtrics.SurveyEngine.setEmbeddedData("Student_Final_End_Time", checking);
    }
}
function recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date) {
    var time_split = student_test_start_time.split(":");
    var hrs1 = parseInt(time_split[0], 10);
    var multiplying_factor;
    var min_arr = time_split[1].split(" ");
    var mins1, ampmcheck;
    if (min_arr.length == 2) {
        mins1 = parseInt(min_arr[0]);
        ampmcheck = min_arr[1].toUpperCase();
    }
    else if (min_arr.length == 1) {
        mins1 = min_arr.substring(0, 2);
        ampmcheck = min_arr.substring(2).toUpperCase();
    }
    if (ampmcheck == "PM" && hrs1 != 12) {
        hrs1 += 12;
    }
    if ((ampmcheck == 'PM' && ((hrs1 > 17 && hrs1 <= 23) || (hrs1 == 17 && mins1 > 0))) || (ampmcheck == 'AM' && ((hrs1 >= 1 && hrs1 < 8) || (hrs1 == 8 && mins1 <= 29) || hrs1 == 12))) {
        return 4;
    }
    if (hrs1 == 8) {
        if (mins1 != 30 && ampmcheck == 'AM') {
            return 5;
        }
    }
    else if (hrs1 != 8) {
        if (ampmcheck == 'AM' && !(hrs1 > 8 && hrs1 < 12 && mins1 == 0)) {
            return 5;
        }
    }
    if (ampmcheck == 'PM' && !(hrs1 >= 12 && hrs1 <= 17 && mins1 == 0)) {
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
    try {
        var with_without_check = "${q://QID30/ChoiceGroup/SelectedChoices}";
        var checker = "Professor/instructor approves <u><strong>without</strong></u> changes";
        var out = "${q://QID57/ChoiceGroup/SelectedChoices}";
        var student_accoms = "${e://Field/StudInputAccomms}";
        var student_test_start_time = "${e://Field/Student_Another_Time_Field}";
        var new_final_date = "${e://Field/Student_Another_Date_Field}";
        var check_changed_exam_date = "Test Date";
        var check_changed_total_time_allowed = "Total Time Allowed (minutes)";
        var check_changed_start_time = "Test start time";
        var date_modified, checking;
        if (checker.includes(with_without_check)) {
            var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
            var checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
            alert_message_popup(checking, new_final_date, student_test_start_time);
        }
        else {
            if (out.includes(check_changed_exam_date)) {
                try {
                    date_modified = "${q://QID57/ChoiceTextEntryValue/1}";
                    new_final_date = date_validator(date_modified);
                    var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
                    if (new_final_date != 404) {
                        checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
                        console.log(new_final_date);
                        if (new_final_date != undefined) {
                            alert_message_popup(checking, new_final_date, student_test_start_time);
                            Qualtrics.SurveyEngine.setEmbeddedData("StudInputTestDate", new_final_date);
                            Qualtrics.SurveyEngine.setEmbeddedData("ProfInputTestDate", new_final_date);
                        }
                    }
                    else if (new_final_date == 404) {
                        var d;
                    }
                }
                catch (error) {
                    if (error instanceof TypeError) {
                        alert("Please enter a valid date");
                        $('NextButton').disabled = true;
                    }
                }
            }
            if (date_validator(new_final_date) != 404) {
                if (out.includes(check_changed_start_time)) {
                    try {
                        student_test_start_time = "${q://QID57/ChoiceTextEntryValue/3}";
                        var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
                        checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
                        alert_message_popup(checking, new_final_date, student_test_start_time);
                    }
                    catch (error) {
                        alert("Change the time");
                        count++;
                    }
                }
            }
            if (date_validator(new_final_date) != 404) {
                if (out.includes(check_changed_total_time_allowed)) {
                    try {
                        var new_time = "${q://QID57/ChoiceTextEntryValue/2}";
                        checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
                        alert_message_popup(checking, new_final_date, student_test_start_time);
                    }
                    catch (error) {
                        alert("Please check block 3");
                        count++;
                    }
                }
            }
            else {
                var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
                checking = recalculate_duration(new_time, student_accoms, student_test_start_time, new_final_date);
                alert_message_popup(checking, new_final_date, student_test_start_time);
            }
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            alert("Please check the errors");
            count++;
            $('NextButton').disabled = true;
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