// -------------------------------- Get Weather Info From OpenWeather  --------------------------------
    
let newsUsername = 'API KEY HERE'

function getNews(country){
    $.ajax({
        url: "libs/php/getNews.php",
        type: 'GET',
        dataType: 'json',
        data: {
            country: country.iso_a2,
            user: newsUsername
        },
        success: function(result) {
                        
            if (result.status.name == "ok") {

                // Modal 4 - News Articles - ([Image] [Title] [URL] [Source] [Published])
                country.news_article1.push(result['data']['articles']['0']['urlToImage'], result['data']['articles']['0']['title'], result['data']['articles']['0']['url'], result['data']['articles']['0']['source']['name'], result['data']['articles']['0']['publishedAt']);

                country.news_article2.push(result['data']['articles']['1']['urlToImage'], result['data']['articles']['1']['title'], result['data']['articles']['1']['url'], result['data']['articles']['1']['source']['name'], result['data']['articles']['1']['publishedAt']);
                
                country.news_article3.push(result['data']['articles']['2']['urlToImage'], result['data']['articles']['2']['title'], result['data']['articles']['2']['url'], result['data']['articles']['2']['source']['name'], result['data']['articles']['2']['publishedAt'])

            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(JSON.stringify(jqXHR));
            console.log(JSON.stringify(textStatus));
            console.log(JSON.stringify(errorThrown));
        }
    }); 
}