var count = 0, time_display;
Qualtrics.SurveyEngine.addOnload(function () {
    /*Place your JavaScript here to run when the page loads*/
    var another_random = "${e://Field/checker}";
    another_random = 0;
    var selected_start_time = "${q://QID13/ChoiceGroup/SelectedChoices}";
    var courses_selected = "${q://QID9/ChoiceGroup/SelectedChoicesTextEntry}";
    var time_alloted_for_class = parseInt("${q://QID29/ChoiceGroup/SelectedChoicesTextEntry}");
    var selected_extra_time_accommodation = "${q://QID58/ChoiceGroup/SelectedChoices}";
    var x2 = "Extra time for in-class assignments tests and quizzes increased to double time (2X)";
    var x15 = "Extra time for in-class assignments tests and quizzes increased to time and a half (1.5X)";
    var x25 = "Extra time for in-class assignments tests and quizzes increased to double and one half time (2.5X)";
    var c2 = selected_extra_time_accommodation.includes(x2);
    var c15 = selected_extra_time_accommodation.includes(x15);
    var c25 = selected_extra_time_accommodation.includes(x25);
    var multiplying_factor;
    if (c2) {
        multiplying_factor = 2;
    }
    else if (c15) {
        multiplying_factor = 1.5;
    }
    else if (c25) {
        multiplying_factor = 2.5;
    }
    else {
        multiplying_factor = 1;
    }
    time_alloted_for_class = Math.floor(time_alloted_for_class * multiplying_factor);
    var time_ = selected_start_time.split(':');
    var hrs_start_time = parseInt(time_[0]);
    var mins_start_time = parseInt(time_[1].split(' ')[0]);
    if (hrs_start_time >= 1 && hrs_start_time <= 5) {
        hrs_start_time += 12;
    }
    var hrs_time_alloted = Math.floor(time_alloted_for_class / 60);
    var mins_time_alloted = time_alloted_for_class % 60;
    var total_hrs = hrs_start_time + hrs_time_alloted;
    var total_mins = mins_time_alloted + mins_start_time;
    var total_hrs1;
    if (total_mins >= 60) {
        total_mins -= 60;
        total_hrs += 1;
    }
    if (total_hrs > 12) {
        total_hrs1 = total_hrs - 12;
    }
    if (total_hrs <= 12) {
        total_hrs1 = total_hrs;
    }
    var ampm = (total_hrs >= 12) ? 'PM' : 'AM'
    var hrs_display = total_hrs1.toString().padStart(2, '0');
    var hrs_display1 = total_hrs.toString().padStart(2, '0');
    var mins_display = total_mins.toString().padStart(2, '0');
    time_display = hrs_display + ':' + mins_display + ' ' + ampm;
    var final_date = "${q://QID4/ChoiceTextEntryValue}";
    var date_split = new Date(final_date);
    if (date_split.getUTCDay() == 5 && ((hrs_display1 >= 15 && mins_display >= 1) || (hrs_display1 > 15)) || (date_split.getUTCDay() >= 1 && date_split.getUTCDay() <= 4) && ((hrs_display1 >= 17 && mins_display >= 1) || (hrs_display1 > 17))) {
        var alert = "Tests must end by 5 PM Monday-Thursday and 3 PM on Friday, click Back to select a different start time or duration.";
        count++;
        another_random++;
        Qualtrics.SurveyEngine.setEmbeddedData("checker", another_random);
        Swal.fire({
            text: alert,
            confirmButtonText: 'Back'
        });
    }
    else if (multiplying_factor == 1) {
        Swal.fire({
            text: "Are you sure you want to schedule this test without using your extended time accommodation?",
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                var alert = "Exam for Course " + courses_selected + " has been accepted on " + final_date + ", which starts at " + selected_start_time + " and ends at " + time_display + ". To finalize your request, click Continue.";
                Qualtrics.SurveyEngine.setEmbeddedData("Student_Final_End_Time", time_display);
                Swal.fire({
                    text: alert,
                    confirmButtonText: 'Continue'
                });
            }
            else if (!result.isConfirmed) {
                $("NextButton").disabled = true;
                count++;
                $('PreviousButton').click();
            }
        })
    }
    else {
        var alert = "Exam for Course " + courses_selected + " has been accepted on " + final_date + ", which starts at " + selected_start_time + " and ends at " + time_display + ". To finalize your request, click Continue.";
        Qualtrics.SurveyEngine.setEmbeddedData("Student_Final_End_Time", time_display);
        Swal.fire({
            text: alert,
            confirmButtonText: 'Continue'
        });
    }

});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/
    if (count != 0) {
        $('NextButton').disabled = true;
        $('PreviousButton').click();
    }
});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/
});