const miFormulario = document.querySelector('form');

var url = (window.location.hostname.includes('localhost'))
                    ? 'http://localhost:8080/api/auth/'
                    : 'https://restserver-node-kevin.herokuapp.com/api/auth/'

miFormulario.addEventListener('submit', ev => {
    ev.preventDefault();
    const formData = {};

    for (let el of miFormulario.elements) {
        if (el.name.length > 0)
            formData[el.name] = el.value;
    }

    fetch(url + 'login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'content-Type': 'application/json'}
    })
    .then(resp => resp.json())
    .then(data => {
        const msg = data.msg;

        if (msg) 
            return console.error(msg);

        const token = data.token;
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    })
    .catch(err => {
        console.log(err);
    })
})

function handleCredentialResponse(response) {
    // Google Token : ID_TOKEN

    const body = { id_token: response.credential }

    fetch(url + 'google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(resp => resp.json())
    .then(resp => {
        const token = resp.token;
        localStorage.setItem('token', token);
    })
    .catch(console.warn);
    window.location = 'chat.html';
    
}

const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    // Sign out
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        localStorage.clear();
    });
}