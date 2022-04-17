
function showNotification(message, isError = false) {
    // Gives a short toast
    const notification = document.getElementById('notification');
    const notice = document.createElement('div');
    notice.classList.add('toast');
    if (isError === true)
        notice.innerHTML = `<i class="fa fa-exclamation-circle fa-lg" aria-hidden="true" style='color: red;'></i>&nbsp;&nbsp;${message}`;
    else
        notice.innerHTML = `<i class="fa fa-check-circle fa-lg" aria-hidden="true" style='color: #99C24D;'></i>&nbsp;&nbsp;${message}`;

    notification.insertBefore(notice, notification.firstChild);
    setTimeout(() => notice.remove(), 3000);
}