// -------------------------------- Button 1 - Country Information --------------------------------

L.easyButton({
    position: 'topleft',
    id: 'countryBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Country Information',
        onClick: function(btn,map) {
            Swal.fire({
                title: currentCountry.name,
                html: `
                
                <img src=${currentCountry.flag} class="flag"><br>
        
                <table>
                    <tr class="heading">
                        <th colspan="2">Country Information</th>
                    </tr>
                    <tr>
                        <td class="countryInfo">Country Name: </td>
                        <td class="countryData">${currentCountry.name}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Capital City: </td>
                        <td class="countryData">${currentCountry.capitalCity}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Timezone: </td>
                        <td class="countryData">${currentCountry.timezone}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Time Offset (GMT): </td>
                        <td class="countryData">${currentCountry.timeOffset}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Population: </td>
                        <td class="countryData">${currentCountry.population}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Area (KM²): </td>
                        <td class="countryData">${currentCountry.area}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Language: </td>
                        <td class="countryData">${currentCountry.languages}</td>
                    </tr>
        
                    <tr class="heading">
                        <th colspan="2">Travel Information</th>
                    </tr>
                    <tr>
                        <td class="countryInfo">Currency Code: </td>
                        <td class="countryData">${currentCountry.currencyCode} (${currentCountry.currencySymbol})</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Currency Name: </td>
                        <td class="countryData">${currentCountry.currencyName}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Current Exchange Rate: </td>
                        <td class="countryData">${currentCountry.exchangeRate}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Top Level Domain (www): </td>
                        <td class="countryData">${currentCountry.topLevelDomain}</td>
                    </tr>
                    <tr>
                        <td class="countryInfo">Calling Code: </td>
                        <td class="countryData">+${currentCountry.callingCode}</td>
                    </tr>
        
                </table>
                
                `,
                confirmButtonText: 'OK',
                background: '#D3D3D3'
            })
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]
}).addTo(mymap);



// -------------------------------- Button 2 - Weather --------------------------------

L.easyButton({

    id: 'weatherBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Weather Forecast',
        onClick: function(btn,map) {
            
            // Calculate the upcoming days
            const d = new Date();
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var twoDays = d.getDay() + 2;
            var threeDays = d.getDay() + 3;

            if(twoDays > 6){
                twoDays -=7;
            } 
            if (threeDays > 6){
                threeDays -= 7;
            }

            twoDays = days[twoDays], 
            threeDays = days[threeDays];

            Swal.fire({
                title: `Weather Forecast for <br> <b>${currentCountry.name}</b>`,
                html: `
                    <table>
                    
                        <tr class="heading">
                            <th colspan="3">Current</th>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Temperature (F): </td>
                            <td class="weatherData">${currentCountry.weather_current[0]}</td>
                            <td rowspan="3"><img id="wicon" src="http://openweathermap.org/img/w/${currentCountry.weather_current[3]}.png" alt="Current Weather Icon"></td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Feels Like (F): </td>
                            <td class="weatherData">${currentCountry.weather_current[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Conditions: </td>
                            <td class="weatherData">${currentCountry.weather_current[2]}</td>
                        </tr>

                        <tr class="heading">
                            <th colspan="3">Tomorow</th>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Temperature (F): </td>
                            <td class="weatherData">${currentCountry.weather_tomorrow[0]}</td>
                            <td rowspan="3"><img id="wicon" src="http://openweathermap.org/img/w/${currentCountry.weather_tomorrow[3]}.png" alt="Tomorrow Weather Icon"></td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Feels Like (F): </td>
                            <td class="weatherData">${currentCountry.weather_tomorrow[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Conditions: </td>
                            <td class="weatherData">${currentCountry.weather_tomorrow[2]}</td>
                        </tr>  

                        <tr class="heading">
                            <th colspan="3">${twoDays}</th>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Temperature (F): </td>
                            <td class="weatherData">${currentCountry.weather_2days[0]}</td>
                            <td rowspan="3"><img id="wicon" src="http://openweathermap.org/img/w/${currentCountry.weather_2days[3]}.png" alt="twoDays Weather Icon"></td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Feels Like (F): </td>
                            <td class="weatherData">${currentCountry.weather_2days[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Conditions: </td>
                            <td class="weatherData">${currentCountry.weather_2days[2]}</td>
                        </tr>  

                        <tr class="heading">
                            <th colspan="3">${threeDays}</th>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Temperature (F): </td>
                            <td class="weatherData">${currentCountry.weather_3days[0]}</td>
                            <td rowspan="3"><img id="wicon" src="http://openweathermap.org/img/w/${currentCountry.weather_3days[3]}.png" alt="threeDays Weather Icon"></td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Feels Like (F): </td>
                            <td class="weatherData">${currentCountry.weather_3days[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Conditions: </td>
                            <td class="weatherData">${currentCountry.weather_3days[2]}</td>
                        </tr>  
                    </table>

                    `,
                    confirmButtonText: 'OK',
                    background: '#D3D3D3'
            })
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);


// -------------------------------- Button 3 - Coronavirus Tracker --------------------------------

L.easyButton({

    id: 'covidBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show COVID-19 Country Statistics',
        onClick: function(btn,map) {
            Swal.fire({
                title: `Coronavirus Statistics for <br> <b>${currentCountry.name}</b>`,
                html: `
                    <table>            
                        <tr class="heading">
                            <th colspan="2">Total</th>
                        </tr>
        
                        <tr>
                            <td class="weatherInfo">Total Cases: </td>
                            <td class="weatherData">${currentCountry.covid_total[0]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Total Deaths: </td>
                            <td class="weatherData">${currentCountry.covid_total[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Total Recovered: </td>
                            <td class="weatherData">${currentCountry.covid_total[2]}</td>
                        </tr>
        
        
                        <tr class="heading">
                            <th colspan="2">Past 24 Hours</th>
                        </tr>
        
                        <tr>
                            <td class="weatherInfo">New Cases: </td>
                            <td class="weatherData">${currentCountry.covid_latest[0]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">New Deaths: </td>
                            <td class="weatherData">${currentCountry.covid_latest[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">New Recovered: </td>
                            <td class="weatherData">${currentCountry.covid_latest[2]}</td>
                        </tr>
        
        
                        <tr class="heading">
                            <th colspan="2">3 Months Ago</th>
                        </tr>
        
                        <tr>
                            <td class="weatherInfo">Total Cases: </td>
                            <td class="weatherData">${currentCountry.covid_3MonthsAgo[0]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Total Deaths: </td>
                            <td class="weatherData">${currentCountry.covid_3MonthsAgo[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Total Recovered: </td>
                            <td class="weatherData">${currentCountry.covid_3MonthsAgo[2]}</td>
                        </tr>
        
        
                        <tr class="heading">
                            <th colspan="2">6 Months Ago</th>
                        </tr>
        
                        <tr>
                            <td class="weatherInfo">Total Cases: </td>
                            <td class="weatherData">${currentCountry.covid_6MonthsAgo[0]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Total Deaths: </td>
                            <td class="weatherData">${currentCountry.covid_6MonthsAgo[1]}</td>
                        </tr>
                        <tr>
                            <td class="weatherInfo">Total Recovered: </td>
                            <td class="weatherData">${currentCountry.covid_6MonthsAgo[2]}</td>
                        </tr>
                    </table>
        
                    `,
                    confirmButtonText: 'OK',
                    background: '#D3D3D3'
                });
        
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);



// -------------------------------- Button 4 - Country News --------------------------------

L.easyButton({

    id: 'newsBtn',
    states: [{
        icon: "none",
        stateName: 'unchecked',
        title: 'Show Top Country News',
        onClick: function(btn,map) {
            if(currentCountry.news_article1[0]){
                Swal.fire({
                    title: `Latest Top News Stories for <br> <b>${currentCountry.name}</b>`,
                    html: ` 
                        <table>
        
                            <tr class="heading">
                                <th>Top Breaking Story:</th>
                            <tr>
        
                            <tr class="newsStat">
                                <td>
                                    <a href="${currentCountry.news_article1[2]}" target="_blank"> <br> ${currentCountry.news_article1[1]}</a> <br>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="${currentCountry.news_article1[2]}" target="_blank">
                                        <img class="newsImg" src="${currentCountry.news_article1[0]}" alt="News image 1">
                                    </a> 
                                </td>
                            </tr>        
        
                            <tr class="heading">
                                <th>Additional News: </th>
                            <tr>
                            
                            <tr class="newsStat">
                                <td>
                                    <a href="${currentCountry.news_article2[2]}" target="_blank"> <br> ${currentCountry.news_article2[1]}</a> <br> 
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="${currentCountry.news_article2[2]}" target="_blank">
                                        <img class="newsImg" src="${currentCountry.news_article2[0]}" alt="News image 2">
                                    </a> 
                                </td>
                            </tr>
        
                            <tr class="heading">
                                <th>Other Headlines: </th>
                            <tr>
        
                            <tr class="newsStat">
                                <td>
                                    <a href="${currentCountry.news_article3[2]}" target="_blank"> <br> ${currentCountry.news_article3[1]}</a> <br>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <a href="${currentCountry.news_article3[2]}" target="_blank">
                                        <img class="newsImg" src="${currentCountry.news_article3[0]}" alt="News image 3">
                                    </a> 
                                </td>
                            </tr>
                        </table>
        
                        `,
                        confirmButtonText: 'OK',
                        background: '#D3D3D3'
                });
            } else {
                Swal.fire({
                    title: `Sorry...`,
                    html: `
                        It looks there is no available news to display for ${currentCountry.name} right now.
                    `,
                    confirmButtonText: 'OK',
                    background: '#D3D3D3'
                });
            }
        }
    }, {
        icon: '&#x238C;',
        stateName: 'checked',
        onClick: function(btn,map) {
            btn.state('unchecked');
        }
    }]


}).addTo(mymap);
