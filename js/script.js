const form = document.querySelector(".widget__search-elements-form");
const input = form.elements["autocomplete-input"];
const widgetMarkup = document.querySelector(".widget__markup");
const timeNode = document.querySelector(".widget__time-item");
const preloader = document.querySelector(".preloader-wrapper");

M.AutoInit();
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".modal");
  M.Modal.init(elems, {
    opacity: 0.6,
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  getWeather(input.value);
});

async function getWeather(city) {
  try {
    preloader.classList.add("active");
    let url = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=5d066958a60d315387d9492393935c19`
    );
    if (url.status >= 400 && url.status < 600) {
      throw new Error("Bad response from server");
    } else {
      preloader.classList.remove("active");
      let data = await url.json();
      getWeatherMarkup(
        data.name,
        Math.round(data.main.temp),
        data.weather[0].icon,
        data.weather[0].description,
        data.sys.country
      );
      input.value = "";
    }
  } catch (err) {
    alert("City not found");
    preloader.classList.remove("active");
  }
}

function getWeatherMarkup(name, temp, icon, description, country) {
  widgetMarkup.insertAdjacentHTML(
    "beforeend",
    `
      <div class='col s5 m3 l2 widget__markup-element'>
          <div class='widget__markup-element-city-wrap'>
            <p>
              <span class='widget__markup-element-city-name'>${name}</span>
              <sup class='widget__markup-element-country-name orange'>${country}</sup>
            </p>
          </div>
          <div class='widget__markup-element-temp'>
              <p>${temp}<sup class='widget__markup-element-temp-celcium'>&#8451</sup></p>
          </div>
          <div class='widget__markup-element-img'>
              <img src='http://openweathermap.org/img/w/${icon}.png' width='60' height='60' alt='weather-icon'>
          </div>
          <div class='widget__markup-element-descript'>
              <p><span>${description}</span></p>
          </div>
      <div>
    `
  );
}
