var count = 0, count1 = 0, count2 = 0, new_time_display, student_test_start_time, student_test_end_time;
function date_validator(date_modified) {
    var date_1 = date_modified.split(" ").join("");
    var today = new Date();
    var darr = date_1.split("/");
    try {
        if (darr.length == 3) {
            var dd = String(today.getDate());
            var mm = String(today.getMonth() + 1);
            var y1 = today.getFullYear();
            var yr = parseInt(darr[2]);
            var yr_length = ('' + yr).length;
            var mnth = parseInt(darr[0]) - 1;
            var dy = parseInt(darr[1]);
            var dt = new Date(yr, mnth, dy);
            var today1 = new Date(y1, mm, dd);
            var three_days_check = new Date();
            three_days_check.setDate(today1.getDate() + 3);
            if (dt.getUTCMonth() != mnth || dt.getUTCFullYear() != yr || dt.getUTCDate() != dy) {
                alert("Please enter a valid date. Click on OK to modify the date.");
                count1 = 404;
                count2++;
                count++;
                return count1;
            }
            else if (yr_length != 4) {
                throw (error);
            }
            else if (dt.getUTCDay() == 6 || dt.getUTCDay() == 0) {
                alert("Tests may not be scheduled on weekends, please enter another date to continue. Click on OK to modify the date.");
                count1 = 404;
                count2++;
                count++;
                return count1;
            }
            else if ((yr < y1) || (mnth + 1 < mm) || (mnth + 1 == mm && dy < dd) || (mnth + 1 > mm && yr < y1)) {
                alert("Tests cannot be scheduled in the past. Click on OK to modify the date.");
                count1 = 404;
                count2++;
                count++;
                return count1;
            }
            else if ((mnth + 1 == 8 && dy >= 10 && yr >= y1) || (mnth + 1 >= 9 && yr == y1) || (yr > y1)) {
                alert("Please select a valid date within the semester to continue. Click on OK to modify the date.");
                count1 = 404;
                count2++;
                count++;
                return count1;
            }
            else if ((mnth + 1 == 7 && dy == 4) || (mnth + 1 == 6 && dy == 19) || (mnth + 1 == 5 && dy == 29)) {
                alert("The university is closed on the selected date. Please choose another date. Click on OK to modify the date.");
                count1 = 404;
                count2++;
                count++;
                return count1;
            }
            else if (dt < three_days_check) {
                alert("We are sorry but date changes cannot be accepted without 3 days notice. Please enter a date at least 3 days from today or leave the date as is. Click on OK to modify the date.");
                count1 = 404;
                count2++;
                count++;
                return count1;
            }
            else {
                return date_1;
            }
        }
        else if (darr.length != 3) {
            throw (error);
        }
    }
    catch (error) {
        window.alert("Please enter date in MM/DD/YYYY format.");
        count++;
    }
}
function counter(alert) {
    Swal.fire({
        text: alert,
        confirmButtonText: 'Continue'
    });
}
function alert_message_popup(student_test_end_time, new_final_date, student_test_start_time) {
    if (student_test_end_time == 4) {
        window.alert("Exams cannot be scheduled when ARC is closed.");
        count++;
    }
    else if (student_test_end_time == 5) {
        window.alert("With the exception of 8:30 AM, all other tests must start on the hour (for example 9:00 AM, 10:00 AM, 3:00 PM etc.). ");
        count++;
    }
    else if (student_test_end_time == 1) {
        window.alert("Tests must end by 5 PM Monday-Thursday and 3 PM on Friday. Please click OK to return to the screen where you may select a different start time.");
        count++;
    }
    else {
        var alert = "Exam has been accepted on " + new_final_date + ", which starts at " + student_test_start_time + " and ends at " + student_test_end_time + ". To finalize your request, click Continue.";
        counter(alert);
        Qualtrics.SurveyEngine.setEmbeddedData("StudInputStartTime", student_test_start_time);
        Qualtrics.SurveyEngine.setEmbeddedData("Student_Final_End_Time", student_test_end_time);
    }
}
function recalculate_duration(new_time, selected_student_accommodations, student_test_start_time, new_final_date) {
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
    if (selected_student_accommodations.includes(x2)) {
        multiplying_factor = 2;
    }
    else if (selected_student_accommodations.includes(x15)) {
        multiplying_factor = 1.5;
    }
    else if (selected_student_accommodations.includes(x25)) {
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
    if (new_date_split.getUTCDay() == 5 && ((new_th1_display >= 15 && new_mins_display >= 1) || (new_th1_display > 15)) || (new_date_split.getUTCDay() >= 1 && new_date_split.getUTCDay() <= 4) && (new_th1_display >= 17 && new_mins_display >= 1 || (new_th1_display > 17))) {
        return 1;
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
        var changes_to_time_date = "${q://QID57/ChoiceGroup/SelectedChoices}";
        var selected_student_accommodations = "${e://Field/StudInputAccomms}";
        var student_test_start_time = "${e://Field/Student_Another_Time_Field}";
        var new_final_date = "${e://Field/Student_Another_Date_Field}";
        var check_changed_exam_date = "Test Date";
        var check_changed_total_time_allowed = "Total Time Allowed (minutes)";
        var check_changed_start_time = "Test start time";
        var date_modified, student_test_end_time;
        if (checker.includes(with_without_check)) {
            var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
            student_test_end_time = recalculate_duration(new_time, selected_student_accommodations, student_test_start_time, new_final_date);
            alert_message_popup(student_test_end_time, new_final_date, student_test_start_time);
        }
        else {
            if (changes_to_time_date.includes(check_changed_exam_date)) {
                try {
                    date_modified = "${q://QID57/ChoiceTextEntryValue/1}";
                    new_final_date = date_validator(date_modified);
                    var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
                    if (new_final_date != 404) {
                        student_test_end_time = recalculate_duration(new_time, selected_student_accommodations, student_test_start_time, new_final_date);
                        if (new_final_date != undefined) {
                            Qualtrics.SurveyEngine.setEmbeddedData("StudInputTestDate", new_final_date);
                            Qualtrics.SurveyEngine.setEmbeddedData("ProfInputTestDate", new_final_date);
                        }
                    }
                    else if (new_final_date == 404) {
                        void 0;
                    }
                }
                catch (error) {
                    alert("Please enter a valid date.");
                    count2++;
                    count++;
                }
            }
            if (changes_to_time_date.includes(check_changed_start_time)) {
                if (count2 == 0) {
                    if (date_validator(new_final_date) != 404) {
                        try {
                            student_test_start_time = "${q://QID57/ChoiceTextEntryValue/3}";
                            var timeregex = /^(0?[1-9]|1[0-2]):[0-5][0-9] [AP]M$/;
                            if (!timeregex.test(student_test_start_time)) {
                                throw (error);
                                count1 = 404;
                                count2++;
                                count++;
                            }
                            else {
                                var new_time = "${e://Field/StudentInputTimeGivenToClassforTest}";
                                student_test_end_time = recalculate_duration(new_time, selected_student_accommodations, student_test_start_time, new_final_date);
                            }
                        }
                        catch (error) {
                            alert("Please enter time in HH:MM AM/PM format.");
                            student_test_end_time = undefined;
                            count++;
                        }
                    }
                }
            }
            if (count2 == 0) {
                if (date_validator(new_final_date) != 404) {
                    if (changes_to_time_date.includes(check_changed_total_time_allowed)) {
                        var new_time = "${q://QID57/ChoiceTextEntryValue/2}";
                        student_test_end_time = recalculate_duration(new_time, selected_student_accommodations, student_test_start_time, new_final_date);
                    }
                }
            }
            if (new_final_date != 404 && student_test_end_time != undefined && new_time != undefined) {
                alert_message_popup(student_test_end_time, new_final_date, student_test_start_time);
            }
        }
    }
    catch (error) {
        count++;
    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/
    if (count != 0) {
        $('NextButton').disabled = true;
        $('PreviousButton').click();
        $('PreviousButton').click();
    }
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
