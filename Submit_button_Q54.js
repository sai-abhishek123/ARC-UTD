Qualtrics.SurveyEngine.addOnload(function () {
	/*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function () {
	jQuery('ul li:eq(0)').find('input[type="checkbox"]').change(function () {
		if (jQuery(this).is(':checked')) {
			jQuery('ul li:gt(0)').each(function () {
				jQuery(this).find('input[type="checkbox"]').prop('checked', true);
			});
		} else {
			var allChecked = true;
			jQuery('ul li:gt(0)').each(function () {
				if (!jQuery(this).find('input[type="checkbox"]').is(':checked')) {
					allChecked = false;
					return false;
				}
			});
			if (allChecked) {
				jQuery('ul li:gt(0)').each(function () {
					jQuery(this).find('input[type="checkbox"]').prop('checked', false);
				});
			}
		}
	});
	var another_random = "${e://Field/checker}";
	console.log(another_random);
	if (another_random != 0) {
		$("PreviousButton").click();
	}
	var a1 = 0;
	Qualtrics.SurveyEngine.setEmbeddedData("checker", a1);
});

Qualtrics.SurveyEngine.addOnUnload(function () {
	/*Place your JavaScript here to run when the page is unloaded*/
});