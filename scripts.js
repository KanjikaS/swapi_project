$(document).ready(function() {
    $('.api-button').on('click', function() {
        var endpoint = $(this).data('endpoint');
        fetchData(endpoint);
    });

    function fetchData(endpoint) {
        var url = `https://swapi.dev/api/${endpoint}/`;

        $.ajax({
            url: url,
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                localStorage.setItem('apiData', JSON.stringify(data));
                localStorage.setItem('endpoint',endpoint)
                window.location.href = 'details.html';
            },
            error: function() {
                alert('Failed to fetch data');
            }
        });
    }
});
