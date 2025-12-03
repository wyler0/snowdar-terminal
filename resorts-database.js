// Comprehensive ski resort database with coordinates
// Data compiled from Wikipedia, OpenStreetMap, and official resort sources

const SKI_RESORTS = [
    // ========== NORTH AMERICA - USA ==========
    
    // COLORADO
    { name: "Vail", coords: [39.6403, -106.3742], elevation: 2500, region: "Central Colorado" },
    { name: "Breckenridge", coords: [39.4817, -106.0384], elevation: 2926, region: "Central Colorado" },
    { name: "Keystone", coords: [39.6050, -105.9347], elevation: 2835, region: "Central Colorado" },
    { name: "Arapahoe Basin", coords: [39.6425, -105.8719], elevation: 3286, region: "Central Colorado" },
    { name: "Copper Mountain", coords: [39.5019, -106.1503], elevation: 2926, region: "Central Colorado" },
    { name: "Aspen Mountain", coords: [39.1911, -106.8175], elevation: 2422, region: "Central Colorado" },
    { name: "Aspen Highlands", coords: [39.1825, -106.8553], elevation: 2451, region: "Central Colorado" },
    { name: "Snowmass", coords: [39.2130, -106.9378], elevation: 2473, region: "Central Colorado" },
    { name: "Steamboat", coords: [40.4850, -106.8317], elevation: 2103, region: "Northern Colorado" },
    { name: "Winter Park", coords: [39.8868, -105.7625], elevation: 2743, region: "Northern Colorado" },
    { name: "Loveland", coords: [39.6800, -105.8978], elevation: 3231, region: "Northern Colorado" },
    { name: "Telluride", coords: [37.9375, -107.8123], elevation: 2659, region: "Southern Colorado" },
    { name: "Crested Butte", coords: [38.8997, -106.9653], elevation: 2775, region: "Southern Colorado" },
    { name: "Wolf Creek", coords: [37.4722, -106.7931], elevation: 3215, region: "Southern Colorado" },
    { name: "Silverton Mountain", coords: [37.8853, -107.6653], elevation: 3170, region: "Southern Colorado" },
    
    // UTAH
    { name: "Alta", coords: [40.5883, -111.6378], elevation: 2600, region: "Utah - Wasatch" },
    { name: "Snowbird", coords: [40.5825, -111.6569], elevation: 2365, region: "Utah - Wasatch" },
    { name: "Brighton", coords: [40.5981, -111.5831], elevation: 2601, region: "Utah - Wasatch" },
    { name: "Solitude", coords: [40.6200, -111.5914], elevation: 2451, region: "Utah - Wasatch" },
    { name: "Park City", coords: [40.6514, -111.5078], elevation: 2103, region: "Utah - Park City" },
    { name: "Deer Valley", coords: [40.6369, -111.4783], elevation: 2195, region: "Utah - Park City" },
    { name: "Snowbasin", coords: [41.2156, -111.8569], elevation: 1920, region: "Utah - Ogden" },
    { name: "Powder Mountain", coords: [41.3806, -111.7806], elevation: 2438, region: "Utah - Ogden" },
    
    // CALIFORNIA
    { name: "Palisades Tahoe", coords: [39.1969, -120.2356], elevation: 1890, region: "California - Tahoe" },
    { name: "Heavenly", coords: [38.9350, -119.9403], elevation: 3060, region: "California - Tahoe" },
    { name: "Northstar", coords: [39.2731, -120.1189], elevation: 1920, region: "California - Tahoe" },
    { name: "Kirkwood", coords: [38.6842, -120.0656], elevation: 2377, region: "California - Tahoe" },
    { name: "Sugar Bowl", coords: [39.3017, -120.3419], elevation: 2072, region: "California - Tahoe" },
    { name: "Mammoth Mountain", coords: [37.6308, -119.0326], elevation: 2424, region: "California - Mammoth" },
    { name: "June Mountain", coords: [37.7722, -119.0778], elevation: 2590, region: "California - Mammoth" },
    
    // PACIFIC NORTHWEST
    { name: "Mt. Baker", coords: [48.8597, -121.6714], elevation: 1089, region: "Pacific Northwest - WA" },
    { name: "Stevens Pass", coords: [47.7453, -121.0889], elevation: 1790, region: "Pacific Northwest - WA" },
    { name: "Crystal Mountain", coords: [46.9356, -121.4747], elevation: 2133, region: "Pacific Northwest - WA" },
    { name: "Snoqualmie Pass", coords: [47.4231, -121.4128], elevation: 914, region: "Pacific Northwest - WA" },
    { name: "Mt. Hood Meadows", coords: [45.3319, -121.6644], elevation: 1646, region: "Pacific Northwest - OR" },
    { name: "Timberline", coords: [45.3308, -121.7108], elevation: 1828, region: "Pacific Northwest - OR" },
    { name: "Mt. Bachelor", coords: [43.9792, -121.6889], elevation: 2764, region: "Pacific Northwest - OR" },
    
    // IDAHO
    { name: "Sun Valley", coords: [43.6972, -114.3517], elevation: 2788, region: "Idaho" },
    { name: "Schweitzer", coords: [48.3647, -116.6231], elevation: 1768, region: "Idaho" },
    { name: "Bogus Basin", coords: [43.7722, -116.0933], elevation: 1908, region: "Idaho" },
    { name: "Grand Targhee", coords: [43.7894, -110.9608], elevation: 2438, region: "Idaho/Wyoming" },
    
    // MONTANA
    { name: "Big Sky", coords: [45.2847, -111.4008], elevation: 2804, region: "Montana" },
    { name: "Whitefish Mountain", coords: [48.4856, -114.3569], elevation: 2073, region: "Montana" },
    { name: "Bridger Bowl", coords: [45.8181, -110.8989], elevation: 2134, region: "Montana" },
    { name: "Big Mountain", coords: [48.4897, -114.3597], elevation: 2073, region: "Montana" },
    
    // WYOMING
    { name: "Jackson Hole", coords: [43.5875, -110.8278], elevation: 3185, region: "Wyoming" },
    { name: "Snow King", coords: [43.4706, -110.7619], elevation: 1921, region: "Wyoming" },
    
    // NORTHEAST
    { name: "Stowe", coords: [44.5306, -72.7831], elevation: 1190, region: "Northeast - Vermont" },
    { name: "Killington", coords: [43.6042, -72.8206], elevation: 1293, region: "Northeast - Vermont" },
    { name: "Sugarbush", coords: [44.1358, -72.9031], elevation: 1230, region: "Northeast - Vermont" },
    { name: "Jay Peak", coords: [44.9383, -72.5033], elevation: 1189, region: "Northeast - Vermont" },
    { name: "Stratton", coords: [43.1139, -72.9083], elevation: 1183, region: "Northeast - Vermont" },
    { name: "Mount Snow", coords: [42.9603, -72.9203], elevation: 1158, region: "Northeast - Vermont" },
    { name: "Okemo", coords: [43.4014, -72.7189], elevation: 1067, region: "Northeast - Vermont" },
    { name: "Loon Mountain", coords: [44.0364, -71.6206], elevation: 930, region: "Northeast - NH" },
    { name: "Bretton Woods", coords: [44.2617, -71.4381], elevation: 915, region: "Northeast - NH" },
    { name: "Sunday River", coords: [44.4711, -70.8564], elevation: 823, region: "Northeast - Maine" },
    { name: "Sugarloaf", coords: [45.0314, -70.3131], elevation: 1291, region: "Northeast - Maine" },
    
    // NEW MEXICO
    { name: "Taos Ski Valley", coords: [36.5922, -105.4464], elevation: 2804, region: "New Mexico" },
    { name: "Ski Santa Fe", coords: [35.7856, -105.8156], elevation: 3048, region: "New Mexico" },
    
    // ALASKA
    { name: "Alyeska", coords: [60.9697, -149.0989], elevation: 762, region: "Alaska" },
    
    // ========== CANADA ==========
    
    // BRITISH COLUMBIA
    { name: "Whistler Blackcomb", coords: [50.1163, -122.9574], elevation: 2182, region: "BC - Whistler" },
    { name: "Revelstoke", coords: [50.9978, -118.1950], elevation: 2225, region: "BC - Interior" },
    { name: "Kicking Horse", coords: [51.2989, -117.0547], elevation: 2450, region: "BC - Interior" },
    { name: "Panorama", coords: [50.9803, -116.0558], elevation: 2045, region: "BC - Interior" },
    { name: "Sun Peaks", coords: [50.8792, -119.8856], elevation: 2080, region: "BC - Interior" },
    { name: "Big White", coords: [49.7250, -118.9336], elevation: 2319, region: "BC - Interior" },
    { name: "Silver Star", coords: [50.4014, -119.0731], elevation: 1915, region: "BC - Interior" },
    { name: "Fernie", coords: [49.4647, -115.0706], elevation: 2134, region: "BC - Kootenays" },
    { name: "Red Mountain", coords: [49.0906, -117.8219], elevation: 2075, region: "BC - Kootenays" },
    
    // ALBERTA
    { name: "Lake Louise", coords: [51.4253, -116.1772], elevation: 2637, region: "Alberta Rockies" },
    { name: "Sunshine Village", coords: [51.1125, -115.7633], elevation: 2730, region: "Alberta Rockies" },
    { name: "Nakiska", coords: [50.9667, -115.0667], elevation: 2133, region: "Alberta Rockies" },
    { name: "Marmot Basin", coords: [52.8228, -118.0806], elevation: 2612, region: "Alberta Rockies" },
    
    // QUEBEC
    { name: "Mont-Tremblant", coords: [46.2094, -74.5903], elevation: 875, region: "Quebec" },
    { name: "Le Massif", coords: [47.3306, -70.5831], elevation: 770, region: "Quebec" },
    
    // ========== EUROPE ==========
    
    // FRANCE
    { name: "Chamonix", coords: [45.9237, 6.8694], elevation: 3842, region: "French Alps - North" },
    { name: "Val d'Isère", coords: [45.4489, 6.9797], elevation: 3456, region: "French Alps - Tarentaise" },
    { name: "Tignes", coords: [45.4667, 6.9167], elevation: 3456, region: "French Alps - Tarentaise" },
    { name: "Courchevel", coords: [45.4167, 6.6333], elevation: 3230, region: "French Alps - Tarentaise" },
    { name: "Méribel", coords: [45.4006, 6.5667], elevation: 2952, region: "French Alps - Tarentaise" },
    { name: "Les Trois Vallées", coords: [45.3333, 6.5833], elevation: 3230, region: "French Alps - Tarentaise" },
    { name: "Alpe d'Huez", coords: [45.0906, 6.0697], elevation: 3330, region: "French Alps - South" },
    { name: "Les Deux Alpes", coords: [45.0097, 6.1244], elevation: 3568, region: "French Alps - South" },
    
    // SWITZERLAND
    { name: "Zermatt", coords: [46.0207, 7.7491], elevation: 3883, region: "Swiss Alps - Valais" },
    { name: "Verbier", coords: [46.0964, 7.2281], elevation: 3330, region: "Swiss Alps - Valais" },
    { name: "Saas-Fee", coords: [46.1092, 7.9289], elevation: 3600, region: "Swiss Alps - Valais" },
    { name: "St. Moritz", coords: [46.4908, 9.8355], elevation: 3303, region: "Swiss Alps - East" },
    { name: "Davos", coords: [46.8028, 9.8367], elevation: 2844, region: "Swiss Alps - East" },
    { name: "Arosa", coords: [46.7797, 9.6772], elevation: 2653, region: "Swiss Alps - East" },
    
    // AUSTRIA
    { name: "St. Anton", coords: [47.1275, 10.2639], elevation: 2811, region: "Austrian Alps - Tyrol" },
    { name: "Ischgl", coords: [47.0111, 10.2989], elevation: 2872, region: "Austrian Alps - Tyrol" },
    { name: "Sölden", coords: [46.9692, 11.0039], elevation: 3340, region: "Austrian Alps - Tyrol" },
    { name: "Kitzbühel", coords: [47.4464, 12.3925], elevation: 2000, region: "Austrian Alps - Salzburg" },
    { name: "Saalbach", coords: [47.3906, 12.6347], elevation: 2096, region: "Austrian Alps - Salzburg" },
    { name: "Zell am See", coords: [47.3250, 12.7944], elevation: 2000, region: "Austrian Alps - Salzburg" },
    
    // ITALY
    { name: "Cortina d'Ampezzo", coords: [46.5369, 12.1356], elevation: 3243, region: "Italian Dolomites" },
    { name: "Val Gardena", coords: [46.5667, 11.6833], elevation: 2518, region: "Italian Dolomites" },
    { name: "Alta Badia", coords: [46.5833, 11.8833], elevation: 2778, region: "Italian Dolomites" },
    { name: "Cervinia", coords: [45.9333, 7.6333], elevation: 3883, region: "Italian Alps" },
    
    // SPAIN/ANDORRA
    { name: "Baqueira-Beret", coords: [42.7000, 0.9333], elevation: 2510, region: "Pyrenees - Spain" },
    { name: "Formigal", coords: [42.7667, -0.3667], elevation: 2250, region: "Pyrenees - Spain" },
    { name: "Grandvalira", coords: [42.5397, 1.7344], elevation: 2640, region: "Pyrenees - Andorra" },
    
    // SCANDINAVIA
    { name: "Åre", coords: [63.3989, 13.0819], elevation: 1420, region: "Sweden" },
    { name: "Hemsedal", coords: [60.8631, 8.5450], elevation: 1450, region: "Norway" },
    { name: "Trysil", coords: [61.3167, 12.2667], elevation: 1132, region: "Norway" },
    { name: "Levi", coords: [67.8064, 24.8094], elevation: 531, region: "Finland" },
    
    // ========== ASIA ==========
    
    // JAPAN
    { name: "Niseko United", coords: [42.8048, 140.6869], elevation: 1308, region: "Hokkaido - Niseko" },
    { name: "Rusutsu", coords: [42.7372, 140.8906], elevation: 994, region: "Hokkaido" },
    { name: "Furano", coords: [43.3333, 142.3667], elevation: 1209, region: "Hokkaido" },
    { name: "Hakuba Valley", coords: [36.6989, 137.8311], elevation: 1831, region: "Honshu - Nagano" },
    { name: "Nozawa Onsen", coords: [36.9256, 138.4467], elevation: 1650, region: "Honshu - Nagano" },
    { name: "Shiga Kogen", coords: [36.7333, 138.5167], elevation: 2307, region: "Honshu - Nagano" },
    { name: "Myoko Kogen", coords: [36.8833, 138.1667], elevation: 1454, region: "Honshu - Niigata" },
    
    // SOUTH KOREA
    { name: "Yongpyong", coords: [37.6342, 128.6806], elevation: 1458, region: "South Korea" },
    { name: "Phoenix Park", coords: [37.5833, 128.3167], elevation: 1050, region: "South Korea" },
    
    // ========== SOUTH AMERICA ==========
    
    // CHILE
    { name: "Valle Nevado", coords: [-33.3500, -70.2500], elevation: 3670, region: "Chilean Andes" },
    { name: "Portillo", coords: [-32.8333, -70.1333], elevation: 3332, region: "Chilean Andes" },
    { name: "El Colorado", coords: [-33.3500, -70.3000], elevation: 3333, region: "Chilean Andes" },
    
    // ARGENTINA
    { name: "Cerro Catedral", coords: [-41.1500, -71.4000], elevation: 2388, region: "Argentinian Andes" },
    { name: "Las Leñas", coords: [-35.1667, -70.0833], elevation: 3430, region: "Argentinian Andes" },
    { name: "Cerro Castor", coords: [-54.7833, -68.1333], elevation: 1057, region: "Argentinian Patagonia" },
    
    // ========== OCEANIA ==========
    
    // NEW ZEALAND
    { name: "Queenstown - The Remarkables", coords: [-45.0311, 168.6625], elevation: 1943, region: "New Zealand - South Island" },
    { name: "Coronet Peak", coords: [-44.9667, 168.7667], elevation: 1649, region: "New Zealand - South Island" },
    { name: "Cardrona", coords: [-44.8833, 168.9333], elevation: 1894, region: "New Zealand - South Island" },
    { name: "Mt. Hutt", coords: [-43.5167, 171.4833], elevation: 2086, region: "New Zealand - South Island" },
    
    // AUSTRALIA
    { name: "Perisher", coords: [-36.4000, 148.4167], elevation: 2034, region: "Australia - NSW" },
    { name: "Thredbo", coords: [-36.5000, 148.3000], elevation: 2037, region: "Australia - NSW" },
    { name: "Falls Creek", coords: [-36.8667, 147.2833], elevation: 1842, region: "Australia - Victoria" },
];

module.exports = { SKI_RESORTS };

