var CeleryProgressBar = (function () {
    function onSuccessDefault(progressBarElement, progressBarMessageElement) {
        progressBarElement.style.backgroundColor = '#76ce60';
        progressBarElement.style.display = 'none';
        $(progressBarElement).closest('tr').find('a').attr('class', '');
    }

    function onErrorDefault(progressBarElement, progressBarMessageElement) {
        progressBarElement.style.backgroundColor = '#dc4f63';
        progressBarElement.innerHTML = 'Error';
    }

    function onProgressDefault(progressBarElement, progressBarMessageElement, progress) {
        progressBarElement.style.backgroundColor = '#68a9ef';
        progressBarElement.style.color = '#fff';
        progressBarElement.style.width = progress.percent + "%";
        progressBarElement.innerHTML = progress.percent + "%";
    }

    function updateProgress (progressUrl, options) {
        options = options || {};
        var progressBarId = options.progressBarId || 'progress-bar';
        var progressBarMessage = options.progressBarMessageId || 'progress-bar-message';
        var progressBarElement = options.progressBarElement || document.getElementById(progressBarId);
        var progressBarMessageElement = options.progressBarMessageElement || null;
        var onProgress = options.onProgress || onProgressDefault;
        var onSuccess = options.onSuccess || onSuccessDefault;
        var onError = options.onError || onErrorDefault;
        var pollInterval = options.pollInterval || 500;

        fetch(progressUrl).then(function(response) {
 
            response.json().then(function(data) {
                if (data.progress) {
                    onProgress(progressBarElement, progressBarMessageElement, data.progress);
                }
                if (!data.complete) {
                    setTimeout(updateProgress, pollInterval, progressUrl, options);
                } else {
                    if (data.success) {
                        onSuccess(progressBarElement, progressBarMessageElement);
                    } else {
                        onError(progressBarElement, progressBarMessageElement);
                    }
                }
            });
        });
    }
    return {
        onSuccessDefault: onSuccessDefault,
        onErrorDefault: onErrorDefault,
        onProgressDefault: onProgressDefault,
        updateProgress: updateProgress,
        initProgressBar: updateProgress,  // just for api cleanliness
    };
});
