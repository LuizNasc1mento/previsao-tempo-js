const apiKey = 'eea0e9e49d6e4e14f3f0f2132421d76b'

document.querySelector ('#search').addEventListener ('submit', async (event) => {
event.preventDefault ()

    const cityname = document.querySelector('#city_name').value;

    if (!cityname) {
        document.querySelector ("#weather").classList.remove('show');
         showAlert('Você precisa digitar uma cidade...');
         return
    }
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityname)}&appid=${apiKey}&units=metric&lang=pt_br`

    const results = await fetch (apiUrl);
    const json = await results.json ();

    if (json.cod === 200) {
        showInfo({

            city: json.name,
            country: json.sys.country,
            temp: json.main.temp,
            tempMax: json.main.temp_max,
            tempMin: json.main.temp_min,
            description: json.weather[0].description,
            tempIcon: json.weather[0].icon,
            windSpeed: json.wind.speed,
            humidity: json.main.humidity,
       
            main: json.weather[0].main,
       
        })
    } else {
        document.querySelector ("#weather").classList.remove('show');
            showAlert (`Não foi possivel localizar...<br><img src="src/javascript/styles/imagens/clouds.svg" alt="nuvem"/>`)
            
            
    }
    
});

function showInfo (json){
    showAlert('');

     if (typeof updateBackground === "function") {
        updateBackground(json.main); 
    }


    document.querySelector ("#weather").classList.add('show');

    document.querySelector ('#title').innerHTML = `${json.city}, ${json.country}`

    document.querySelector ('#temp_value').innerHTML = `${json.temp.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`

    document.querySelector ('#temp_description').innerHTML = `${json.description} `
    document.querySelector('#temp_img').setAttribute ('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`)

    document.querySelector ('#temp_max').innerHTML = `${json.tempMax.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`

    document.querySelector ('#temp_min').innerHTML = `${json.tempMin.toFixed(1).toString().replace('.', ',')} <sup>°C</sup>`

    document.querySelector ('#humidity').innerHTML = `${Math.round(json.humidity)}% `

    document.querySelector ('#wind').innerHTML = `${json.windSpeed.toFixed(1).toString().replace('.', ',')}km/h `
}

function showAlert (msg) {
    document.querySelector ('#alert').innerHTML = msg

     const weatherElement = document.querySelector("#weather");
    weatherElement.style.display = 'block';

    setTimeout(() => {
        weatherElement.classList.add('show');
    }, 50);

}

function updateBackground(clima) {
    const body = document.body;
    const cores = {
        'Clear': 'linear-gradient(135deg, #fceeb5 0%, #fba121 100%)',
        'Clouds': 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
        'Rain': 'linear-gradient(135deg, #4b6cb7 0%, #182848 100%)',
        'Default': 'linear-gradient(135deg, #3b82f6 0%, #4a7dff 100%)'
    };
    body.style.background = cores[clima] || cores['Default'];
}

document.querySelector('#geo-btn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            
            const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
            
            const results = await fetch(apiUrl);
            const json = await results.json();

            if (json.cod === 200) {
                showInfo({
                    city: json.name,
                    country: json.sys.country,
                    temp: json.main.temp,
                    tempMax: json.main.temp_max,
                    tempMin: json.main.temp_min,
                    description: json.weather[0].description,
                    tempIcon: json.weather[0].icon,
                    windSpeed: json.wind.speed,
                    humidity: json.main.humidity,
                    main: json.weather[0].main 
                });
            }
        }, () => {
            showAlert('Não foi possível obter sua localização.');
        });
    } else {
        showAlert('Seu navegador não suporta geolocalização.');
    }
});