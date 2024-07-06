$(document).ready(function () {
    const token = $('meta[name="csrf-token"]').attr('content');
    if (token) {
        $.ajaxSetup({
            headers: { 'X-CSRF-Token': token }
        });
    }
});