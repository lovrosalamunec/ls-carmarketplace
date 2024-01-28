let apiMainURL = "https://x8ki-letl-twmt.n7.xano.io/api:HkuGZgUU";
let loader = document.querySelector('.loader-overlay');

//signup
if (document.getElementById('registerBtn')) {

    document.getElementById('registerBtn').onclick = function (e) {
        e.preventDefault();

        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let phone = document.getElementById('phone').value;
        let password = document.getElementById('password').value;
        let repeat_password = document.getElementById('repeat_password').value;

        let apiEndpoint = apiMainURL + "/auth/signup";

        let requestBody = {
            name,
            email,
            phone,
            password,
            repeat_password
        }
        loader.style.display = 'flex';
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                if (data.authToken) {
                    localStorage.setItem('authToken', data.authToken);
                    window.location.href = 'novi_oglas.html';
                }
                loader.style.display = 'none';
            });
    };
}


//adding new item
if (document.getElementById("noviOglasBtn")) {
    document.getElementById("noviOglasBtn").onclick = function (e) {
        e.preventDefault();

        let apiEndpoint = apiMainURL + "/car";

        let formData = new FormData();

        let brand = document.getElementById('brand').value;
        let price = document.getElementById('price').value;
        let fuel = document.getElementById('fuel').value;
        let year = document.getElementById('year').value;
        // let user_id = document.getElementById('user_id').value;
        let body = document.getElementById('body').value;
        let file = document.getElementById('file');


        formData.append('brand', brand);
        formData.append('price', price);
        formData.append('fuel', fuel);
        formData.append('year', year);
        // formData.append('user_id', user_id);
        formData.append('body', body);
        formData.append('file', file.files[0]);

        loader.style.display = 'flex';
        fetch(apiEndpoint, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                alert('Item successfully added. Waiting for approval.');
                location.reload();
                loader.style.display = 'none';
            });
    }
}


//login
if (document.getElementById('loginBtn')) {

    document.getElementById('loginBtn').onclick = function (e) {
        e.preventDefault();

        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let apiEndpoint = apiMainURL + "/auth/login";

        let requestBody = {

            email,
            password
        }

        loader.style.display = 'flex';

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(data => {
                if (data.authToken) {
                    localStorage.setItem('authToken', data.authToken);
                    window.location.href = 'novi_oglas.html';
                    loader.style.display = 'none';
                }


            });
    };
}


//chaning buttons on login
if (localStorage.getItem('authToken')) {
    document.getElementById("navigation").innerHTML = `<a href="novi_oglas.html" class="btn btn-warning">Add a car</a>
                                                        <a href="#" id="odjaviSe" class="btn btn-info">Log Out</a>`;

    document.getElementById("odjaviSe").onclick = function (e) {
        e.preventDefault();

        localStorage.clear();
        window.location.href = 'index.html'
    };
}


//listing all items
if (document.getElementById('sviOglasi')) {
    let currentUrl = window.location.href;
    if (!currentUrl.includes('?')) {


        let apiEndpoint = apiMainURL + "/car";
        loader.style.display = 'flex';
        fetch(apiEndpoint)
            .then(response => response.json())
            .then(cars => {

                let container = document.getElementById('sviOglasi');

                cars.forEach(car => {

                    let carElement = document.createElement('div');

                    carElement.className = 'col-sm-4';
                    carElement.innerHTML = `
                    <div class="car-item-wrapper">
                    <img src="${car.car_image.url}?tpl=big" alt="${car.brand}">
                    <h4>${car.brand}</h4>
                    <p>Price: ${car.price}</p>
                    <p>Year: ${car.year}</p>
                    <a class="btn btn-warning" href="car.html?id=${car.id}">See More</a>
                    </div>
                    `;

                    container.appendChild(carElement);
                });

                loader.style.display = 'none';
            });
    }
}

//listing one item
if (document.getElementById('appendImage')) {
    let urlParams = new URLSearchParams(window.location.search);
    let car_id = urlParams.get('id');
    let apiEndpoint = apiMainURL + "/car/" + car_id;

    loader.style.display = 'flex';
    fetch(apiEndpoint)
        .then(response => response.json())
        .then(car => {
            car = car[0];

            let imageContainer = document.querySelector('#appendImage');
            if (imageContainer) {
                let img = document.createElement('img');
                img.src = `${car.car_image.url}`;
                img.alt = car.brand;
                imageContainer.appendChild(img);
            } else {
                alert('Image container #appendImage not found');
            }

            let contentContainer = document.querySelector('#appendContent');
            if (contentContainer) {
                contentContainer.innerHTML = `
                <h4>${car.brand}</h4>
                <p>Price: ${car.price}</p>
                <p>Year: ${car.year}</p>
                <p>Fuel: ${car.fuel}</p>
                <p>Body type: ${car.body}</p>
                `;
            } else {
                alert('Content container #appendContent not found');
            }

            loader.style.display = 'none';


        })
}



//search
if (document.getElementById('pretraziBtn')) {
    let currentUrl = window.location.href;

    if (currentUrl.includes('?')) {
        let queryParams = new URLSearchParams(window.location.search);

        let brand = queryParams.get('brand');
        let year_from = queryParams.get('year_from');
        let year_to = queryParams.get('year_to');
        let price = queryParams.get('price');
        let fuel = queryParams.get('fuel');
        let body = queryParams.get('body');

        if (brand)
            document.getElementById('brand').value = brand;
        if (fuel)
            document.getElementById('fuel').value = fuel;
        if (body)
            document.getElementById('body').value = body;
        if (year_from)
            document.getElementById('year_from').value = year_from;
        if (year_to)
            document.getElementById('year_to').value = year_to;
        if (price)
            document.getElementById('price').value = price;



        let apiEndpoint = apiMainURL + "/search";

        apiEndpoint += `?brand=${encodeURIComponent(brand)}&price=${price}&gorivo=${encodeURIComponent(gorivo)}&year_from=${year_from}&year_to=${year_to}&body=${encodeURIComponent(body)}`;

        loader.style.display = 'flex';

        fetch(apiEndpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(cars => {

                let container = document.getElementById('sviOglasi');
                container.innerHTML = '';

                cars.forEach(car => {

                    let carElement = document.createElement('div');

                    carElement.className = 'col-sm-4';
                    carElement.innerHTML = `
                <div class="car-item-wrapper">
                <img src="${car.car_image.url}?tpl=big" alt="${car.brand}">
                <h4>${car.brand}</h4>
                <p>Price: ${car.price}</p>
                <p>Year: ${car.year}</p>
                <a class="btn btn-warning" href="car.html?id=${car.id}">See More</a>
                </div>
                `;

                    container.appendChild(carElement);
                });

                loader.style.display = 'none';
            });


    }
}