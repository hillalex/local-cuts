 var config = {
    allowedOrigins : [],
    googleMapsAPIKey  : 'AIzaSyCAyBZQY7rsMwgQYwoYexWBTzIY_BnwH9U',
    geocoderAPI : "https://labour-geocoder-demo.herokuapp.com",
    env : process.env['NODE_ENV'] || 'development',
    noEnglandMessage : "Due to the differing ways that local spending is allocated across the UK, this calculator is restricted to councils in England.",
    noResultsMessage : "We did not find a local authority associated with this postcode. Are you sure you entered it correctly?"
};

module.exports = config;