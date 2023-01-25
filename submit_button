Qualtrics.SurveyEngine.addOnload(function()
{
	/*Place your JavaScript here to run when the page loads*/

});

Qualtrics.SurveyEngine.addOnReady(function()
{
	jQuery('ul li:eq(0)').find('input[type="checkbox"]').change(function(){
	if(jQuery(this).is(':checked'))
	{
		jQuery('ul li:gt(0)').each(function(){
			jQuery(this).find('input[type="checkbox"]').prop('checked',true)
		});
	}
		else
		{
			jQuery('ul li:gt(0)').each(function(){
				jQuery(this).find('input[type="checkbox"]').prop('checked',false)
			});
		}
});	
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});
