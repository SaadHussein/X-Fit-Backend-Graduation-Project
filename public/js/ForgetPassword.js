const PasswordInput = document.getElementById('resetPassword');
const ConfirmPassword = document.getElementById('confirmPassword');
const SubmitForm = document.getElementById('submitForm');

function getTokenFromUrl() {
    const path = window.location.pathname;
    const pathArray = path.split('/');
    const token = pathArray[pathArray.length - 1];
    return token;
}

SubmitForm.addEventListener('click', (e) => {
    e.preventDefault();

    const newPassword = PasswordInput.value;
    const ConfirmNewPassword = ConfirmPassword.value;

    if (newPassword !== ConfirmNewPassword) {
        alert('Must Passwords Equal Each Other.');
        return;
    }

    const token = getTokenFromUrl();

    if (!token) {
        alert('Token not Found in URL.');
        return;
    }

    const data = {
        newPassword,
        ConfirmNewPassword
    };

    const apiURL = `http://localhost:3000/api/v1/user/resetPassword/${token}`;

    fetch(apiURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error Happened in Network.');
            }
        })
        .then((data) => {
            console.log(data);
            alert('Password Changed Successfully.');
        })
        .catch((err) => {
            alert('SomeThing went Wrong.');
        });
});