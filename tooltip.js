Qualtrics.SurveyEngine.addOnload(function() {
    var tooltips = document.querySelectorAll('.tooltip');

    tooltips.forEach(function(tooltipElem) {
        tooltipElem.addEventListener('mouseover', function() {
            var textTooltipContent = this.getAttribute('data-text-tooltip');
            var imageTooltipSrc = this.getAttribute('data-image-tooltip');
            
            if (textTooltipContent) {
                var textTooltipDiv = document.createElement('div');
                textTooltipDiv.className = 'text-tooltip custom-tooltip';
                textTooltipDiv.innerHTML = textTooltipContent;
                this.appendChild(textTooltipDiv);
            }

            if (imageTooltipSrc) {
                var imageTooltipDiv = document.createElement('div');
                imageTooltipDiv.className = 'image-tooltip custom-tooltip';
                imageTooltipDiv.innerHTML = `<img src="https://utdallas.yul1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_GshsX5YdEDgRb8W" alt="Tooltip Image" style="max-width: 100%; height: auto;">`;
                this.appendChild(imageTooltipDiv);
            }
        });

        tooltipElem.addEventListener('mouseout', function() {
            var textTooltips = this.querySelectorAll('.text-tooltip');
            textTooltips.forEach(function(div) {
                div.remove();
            });

            var imageTooltips = this.querySelectorAll('.image-tooltip');
            imageTooltips.forEach(function(div) {
                div.remove();
            });
        });
    });
});




Qualtrics.SurveyEngine.addOnReady(function()
{
	/*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function()
{
	/*Place your JavaScript here to run when the page is unloaded*/

});