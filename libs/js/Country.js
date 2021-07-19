// -------------------------------- Country Object Definition --------------------------------

function Country(name, iso_a2, iso_a3, iso_n3, geoType, coordinates){
    this.name = name;
    this.iso_a2 = iso_a2;
    this.iso_a3 = iso_a3;
    this.iso_n3 = iso_n3;
    this.coordinates = coordinates;
    this.geoType = geoType;
    this.lat;
    this.lng;
    
    // Modal 1 - Country Info
    this.flag;
    this.capitalCity;
    this.timezone;
    this.timeOffset;
    this.population;
    this.area;
    this.languages;

    this.currencyCode;
    this.currencyName;
    this.currencySymbol;
    this.exchangeRate;
    this.topLevelDomain;
    this.callingCode;
    
    // Modal 2 - Weather - ([Temp] [FeelsLike] [Weather] [WeatherIcon])
    this.weather_current = [];
    this.weather_tomorrow = []; 
    this.weather_2days = []; 
    this.weather_3days = []; 
    this.weather_4days = []; 
    
    // Modal 3 - COVID-19 Stats - ([Cases] [Deaths] [Recovered])
    this.covid_total = [];
    this.covid_latest = [];
    this.covid_3MonthsAgo = [];
    this.covid_6MonthsAgo = [];
    
    // Modal 4 - News Articles - ([Image] [Title] [URL] [Source] [Published])
    this.news_article1 = [];
    this.news_article2 = [];
    this.news_article3 = [];

    // Map Markers
    this.marker_capital = [];
    this.marker_cities = [];
    this.marker_mountains = [];
    this.marker_airports = [];
    this.marker_museums = [];
    this.marker_universities = [];
    this.marker_hospitals = [];
    this.marker_ferries = [];
}