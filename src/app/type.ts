import { Session } from "next-auth";

export type User = {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  role: string;
};

export type Car = {
  _id: string;
  brand: string;
  model: string;
};

export type CarBrand = {
  _id: string;
  brand: string;
};

export type Part = {
  _id: string;
  code: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  costPrice: number;
  sellPrice: number;
  amount: number;
};

export type PartType = {
  _id: string;
  name: string;
};

export type PartHistory = {
  _id: string;
  createdAt: Date;
  user: string;
  action: string;
  partCode: string;
  partName: string;
  type: string;
  amount: number;
  brand: string;
  costPrice: number;
  salePrice: number;
};

export const car = [
  { id: "1", brand: "Toyota", model: "Vios" },
  { id: "2", brand: "Toyota", model: "Corolla" },
  { id: "3", brand: "Toyota", model: "Camry" },
  { id: "4", brand: "Toyota", model: "Hilux" },
  { id: "5", brand: "Toyota", model: "Fortuner" },
  { id: "6", brand: "Toyota", model: "Yaris" },
  { id: "7", brand: "Toyota", model: "RAV4" },
  { id: "8", brand: "Toyota", model: "Highlander" },
  { id: "9", brand: "Toyota", model: "Tacoma" },
  { id: "10", brand: "Toyota", model: "Tundra" },
  { id: "11", brand: "Toyota", model: "4Runner" },
  { id: "12", brand: "Toyota", model: "Avalon" },
  { id: "13", brand: "Toyota", model: "Sienna" },
  { id: "14", brand: "Toyota", model: "C-HR" },
  { id: "15", brand: "Toyota", model: "Prius" },
  { id: "16", brand: "Toyota", model: "Land Cruiser" },
  { id: "17", brand: "Toyota", model: "Sequoia" },
  { id: "18", brand: "Toyota", model: "Supra" },
  { id: "19", brand: "Toyota", model: "GR86" },
  { id: "20", brand: "Toyota", model: "Mirai" },
  { id: "32", brand: "Honda", model: "Accord" },
  { id: "33", brand: "Honda", model: "Civic" },
  { id: "34", brand: "Honda", model: "CR-V" },
  { id: "35", brand: "Honda", model: "Fit" },
  { id: "36", brand: "Honda", model: "HR-V" },
  { id: "37", brand: "Honda", model: "Insight" },
  { id: "38", brand: "Honda", model: "Odyssey" },
  { id: "39", brand: "Honda", model: "Passport" },
  { id: "40", brand: "Honda", model: "Pilot" },
  { id: "41", brand: "Honda", model: "Ridgeline" },
  { id: "42", brand: "Honda", model: "Clarity" },
  { id: "43", brand: "Honda", model: "City" },
  { id: "44", brand: "Honda", model: "Jazz" },
  { id: "45", brand: "Honda", model: "Brio" },
  { id: "46", brand: "Honda", model: "Amaze" },
  { id: "47", brand: "Honda", model: "WR-V" },
  { id: "48", brand: "Honda", model: "FREED" },
  { id: "49", brand: "Honda", model: "Mobilio" },
  { id: "50", brand: "Honda", model: "Elysion" },
  { id: "51", brand: "Honda", model: "Legend" },
  { id: "52", brand: "Honda", model: "S660" },
  { id: "53", brand: "Honda", model: "NSX" },
  { id: "54", brand: "Isuzu", model: "D-Max" },
  { id: "55", brand: "Isuzu", model: "MU-X" },
  { id: "56", brand: "Isuzu", model: "Crosswind" },
  { id: "58", brand: "Isuzu", model: "Alterra" },
  { id: "59", brand: "Isuzu", model: "Panther" },
  { id: "60", brand: "Isuzu", model: "Gemini" },
  { id: "61", brand: "Isuzu", model: "Ascender" },
  { id: "62", brand: "Isuzu", model: "Aska" },
  { id: "63", brand: "Isuzu", model: "Rodeo" },
  { id: "64", brand: "Isuzu", model: "VehiCROSS" },
  { id: "65", brand: "Isuzu", model: "Amigo" },
  { id: "66", brand: "Isuzu", model: "Hombre" },
  { id: "67", brand: "Isuzu", model: "Oasis" },
  { id: "68", brand: "Isuzu", model: "Piazza" },
  { id: "69", brand: "Isuzu", model: "Stylus" },
  { id: "70", brand: "Isuzu", model: "Impulse" },
  { id: "71", brand: "Isuzu", model: "Bighorn" },
  { id: "72", brand: "Isuzu", model: "Axiom" },
  { id: "73", brand: "Isuzu", model: "Zen" },
  { id: "75", brand: "Isuzu", model: "Trooper" },
  { id: "77", brand: "Isuzu", model: "MUX" },
  { id: "78", brand: "Isuzu", model: "Fuego" },
  { id: "79", brand: "Isuzu", model: "TF Pickup" },
  { id: "80", brand: "Isuzu", model: "SpaceCab" },
  { id: "81", brand: "Isuzu", model: "SpaceCab Hi-Lander" },
  { id: "82", brand: "Isuzu", model: "D-Max Rodeo" },
  { id: "83", brand: "Isuzu", model: "D-Max Blade" },
  { id: "84", brand: "Isuzu", model: "D-Max Hi-Lander" },
  { id: "85", brand: "Isuzu", model: "D-Max V-Cross" },
  { id: "86", brand: "Isuzu", model: "D-Max X-Series" },
  { id: "87", brand: "Mazda", model: "Mazda2" },
  { id: "88", brand: "Mazda", model: "Mazda3" },
  { id: "89", brand: "Mazda", model: "Mazda6" },
  { id: "90", brand: "Mazda", model: "CX-3" },
  { id: "91", brand: "Mazda", model: "CX-30" },
  { id: "92", brand: "Mazda", model: "CX-5" },
  { id: "93", brand: "Mazda", model: "CX-50" },
  { id: "94", brand: "Mazda", model: "CX-7" },
  { id: "95", brand: "Mazda", model: "CX-8" },
  { id: "96", brand: "Mazda", model: "CX-9" },
  { id: "97", brand: "Mazda", model: "MX-5 Miata" },
  { id: "98", brand: "Mazda", model: "MX-30" },
  { id: "99", brand: "Mazda", model: "BT-50" },
  { id: "100", brand: "Mazda", model: "RX-7" },
  { id: "101", brand: "Mazda", model: "RX-8" },
  { id: "106", brand: "Mazda", model: "Millenia" },
  { id: "107", brand: "Mazda", model: "MPV" },
  { id: "108", brand: "Mazda", model: "Protegé" },
  { id: "109", brand: "Mazda", model: "Tribute" },
  { id: "110", brand: "Mazda", model: "626" },
  { id: "111", brand: "Mazda", model: "929" },
  { id: "112", brand: "Mazda", model: "323" },
  { id: "113", brand: "Mazda", model: "Bongo" },
  { id: "114", brand: "Mazda", model: "Premacy" },
  { id: "115", brand: "Mazda", model: "Verisa" },
  { id: "116", brand: "Mazda", model: "Atenza" },
  { id: "117", brand: "Mazda", model: "Demio" },
  { id: "118", brand: "Mitsubishi", model: "Lancer" },
  { id: "119", brand: "Mitsubishi", model: "Outlander" },
  { id: "120", brand: "Mitsubishi", model: "Pajero" },
  { id: "121", brand: "Mitsubishi", model: "Eclipse Cross" },
  { id: "122", brand: "Mitsubishi", model: "Mirage" },
  { id: "123", brand: "Mitsubishi", model: "ASX" },
  { id: "124", brand: "Mitsubishi", model: "RVR" },
  { id: "125", brand: "Mitsubishi", model: "Galant" },
  { id: "126", brand: "Mitsubishi", model: "L200" },
  { id: "127", brand: "Mitsubishi", model: "Triton" },
  { id: "128", brand: "Mitsubishi", model: "Delica" },
  { id: "129", brand: "Mitsubishi", model: "Grandis" },
  { id: "130", brand: "Mitsubishi", model: "Colt" },
  { id: "131", brand: "Mitsubishi", model: "Fuso" },
  { id: "132", brand: "Mitsubishi", model: "3000GT" },
  { id: "133", brand: "Mitsubishi", model: "i-MiEV" },
  { id: "134", brand: "Mitsubishi", model: "Montero" },
  { id: "135", brand: "Mitsubishi", model: "Lancer Evolution" },
  { id: "136", brand: "Mitsubishi", model: "Mirage G4" },
  { id: "137", brand: "Mitsubishi", model: "Space Star" },
  { id: "138", brand: "Mitsubishi", model: "Lancer Sportback" },
  { id: "139", brand: "Mitsubishi", model: "Attrage" },
  { id: "140", brand: "Mitsubishi", model: "Mirage Asti" },
  { id: "141", brand: "Mitsubishi", model: "Minicab" },
  { id: "142", brand: "Mitsubishi", model: "Mirage Van" },
  { id: "143", brand: "Mitsubishi", model: "Challenger" },
  { id: "144", brand: "Mitsubishi", model: "Starion" },
  { id: "145", brand: "Mitsubishi", model: "Space Wagon" },
  { id: "146", brand: "Mitsubishi", model: "Pajero Sport" },
  { id: "147", brand: "Mitsubishi", model: "Lancer EX" },
  { id: "148", brand: "Mitsubishi", model: "L300" },
  { id: "149", brand: "Mitsubishi", model: "Magna" },
  { id: "150", brand: "Mitsubishi", model: "Verada" },
  { id: "151", brand: "Mitsubishi", model: "Sigma" },
  { id: "152", brand: "Mitsubishi", model: "Mirage Hatchback" },
  { id: "153", brand: "Mitsubishi", model: "Mirage Sedan" },
  { id: "154", brand: "Mitsubishi", model: "Eclipse" },
  { id: "155", brand: "Mitsubishi", model: "Endeavor" },
  { id: "156", brand: "Mitsubishi", model: "Raider" },
  { id: "157", brand: "Mitsubishi", model: "Montero Sport" },
  { id: "158", brand: "Mitsubishi", model: "Nativa" },
  { id: "159", brand: "Mitsubishi", model: "Chariot" },
  { id: "160", brand: "Mitsubishi", model: "Grand Lancer" },
  { id: "161", brand: "Mitsubishi", model: "Galloper" },
  { id: "162", brand: "Mitsubishi", model: "Space Runner" },
  { id: "163", brand: "Mitsubishi", model: "Shogun" },
  { id: "164", brand: "Ford", model: "Fiesta" },
  { id: "165", brand: "Ford", model: "Focus" },
  { id: "166", brand: "Ford", model: "Fusion" },
  { id: "167", brand: "Ford", model: "Mustang" },
  { id: "168", brand: "Ford", model: "Escape" },
  { id: "169", brand: "Ford", model: "Explorer" },
  { id: "170", brand: "Ford", model: "Expedition" },
  { id: "171", brand: "Ford", model: "Edge" },
  { id: "172", brand: "Ford", model: "Ranger" },
  { id: "173", brand: "Ford", model: "F-150" },
  { id: "174", brand: "Ford", model: "F-250" },
  { id: "175", brand: "Ford", model: "F-350" },
  { id: "176", brand: "Ford", model: "Bronco" },
  { id: "177", brand: "Ford", model: "Bronco Sport" },
  { id: "178", brand: "Ford", model: "Maverick" },
  { id: "179", brand: "Ford", model: "EcoSport" },
  { id: "180", brand: "Ford", model: "Taurus" },
  { id: "181", brand: "Ford", model: "Flex" },
  { id: "182", brand: "Ford", model: "Transit" },
  { id: "183", brand: "Ford", model: "Transit Connect" },
  { id: "184", brand: "Ford", model: "C-Max" },
  { id: "185", brand: "Ford", model: "Ka" },
  { id: "186", brand: "Ford", model: "Mondeo" },
  { id: "187", brand: "Ford", model: "Galaxy" },
  { id: "188", brand: "Ford", model: "Kuga" },
  { id: "189", brand: "Ford", model: "S-Max" },
  { id: "190", brand: "Ford", model: "Tourneo" },
  { id: "191", brand: "Ford", model: "GT" },
  { id: "192", brand: "Ford", model: "Thunderbird" },
  { id: "193", brand: "Ford", model: "Excursion" },
  { id: "194", brand: "Suzuki", model: "Swift" },
  { id: "195", brand: "Suzuki", model: "Jimny" },
  { id: "196", brand: "Suzuki", model: "Vitara" },
  { id: "197", brand: "Suzuki", model: "Baleno" },
  { id: "198", brand: "Suzuki", model: "SX4" },
  { id: "199", brand: "Suzuki", model: "Celerio" },
  { id: "200", brand: "Suzuki", model: "Ignis" },
  { id: "201", brand: "Suzuki", model: "Alto" },
  { id: "202", brand: "Suzuki", model: "Splash" },
  { id: "203", brand: "Suzuki", model: "Kizashi" },
  { id: "204", brand: "Suzuki", model: "Grand Vitara" },
  { id: "205", brand: "Suzuki", model: "XL-7" },
  { id: "206", brand: "Suzuki", model: "Equator" },
  { id: "207", brand: "Suzuki", model: "APV" },
  { id: "208", brand: "Suzuki", model: "Carry" },
  { id: "209", brand: "Suzuki", model: "Every" },
  { id: "210", brand: "Suzuki", model: "Jimny Sierra" },
  { id: "211", brand: "Suzuki", model: "Liana" },
  { id: "212", brand: "Suzuki", model: "Cappuccino" },
  { id: "213", brand: "Suzuki", model: "Fronte" },
  { id: "214", brand: "Suzuki", model: "Escudo" },
  { id: "215", brand: "Suzuki", model: "Wagon R+" },
  { id: "216", brand: "Suzuki", model: "Solio" },
  { id: "217", brand: "Suzuki", model: "Palette" },
  { id: "218", brand: "Suzuki", model: "Ertiga" },
  { id: "219", brand: "Suzuki", model: "Across" },
  { id: "220", brand: "Suzuki", model: "S-Cross" },
  { id: "221", brand: "Suzuki", model: "X-90" },
  { id: "222", brand: "Suzuki", model: "Vitara Brezza" },
  { id: "223", brand: "Suzuki", model: "Swift DZire" },
  { id: "224", brand: "Suzuki", model: "Esteem" },
  { id: "225", brand: "Suzuki", model: "Forenza" },
  { id: "226", brand: "Suzuki", model: "Verona" },
  { id: "227", brand: "Suzuki", model: "XL7" },
  { id: "228", brand: "Suzuki", model: "LJ80" },
  { id: "229", brand: "Suzuki", model: "Alivio" },
  { id: "230", brand: "Suzuki", model: "Hustler" },
  { id: "231", brand: "Suzuki", model: "Spacia" },
  { id: "232", brand: "Suzuki", model: "Xbee" },
  { id: "233", brand: "Suzuki", model: "Ciaz" },
  { id: "234", brand: "Suzuki", model: "Karimun" },
  { id: "235", brand: "Suzuki", model: "Mega Carry" },
  { id: "236", brand: "Suzuki", model: "Grand Nomade" },
  { id: "237", brand: "Suzuki", model: "Cultus" },
  { id: "238", brand: "Suzuki", model: "Kizashi" },
  { id: "239", brand: "Nissan", model: "Altima" },
  { id: "240", brand: "Nissan", model: "Maxima" },
  { id: "241", brand: "Nissan", model: "Sentra" },
  { id: "242", brand: "Nissan", model: "Versa" },
  { id: "243", brand: "Nissan", model: "370Z" },
  { id: "244", brand: "Nissan", model: "GT-R" },
  { id: "245", brand: "Nissan", model: "Pathfinder" },
  { id: "246", brand: "Nissan", model: "Rogue" },
  { id: "247", brand: "Nissan", model: "Murano" },
  { id: "248", brand: "Nissan", model: "Armada" },
  { id: "249", brand: "Nissan", model: "Frontier" },
  { id: "250", brand: "Nissan", model: "Titan" },
  { id: "251", brand: "Nissan", model: "NV200" },
  { id: "252", brand: "Nissan", model: "Leaf" },
  { id: "253", brand: "Nissan", model: "Juke" },
  { id: "254", brand: "Nissan", model: "Kicks" },
  { id: "255", brand: "Nissan", model: "NV Cargo" },
  { id: "256", brand: "Nissan", model: "NV Passenger" },
  { id: "257", brand: "Nissan", model: "NV200 Taxi" },
  { id: "258", brand: "Nissan", model: "Quest" },
  { id: "259", brand: "Nissan", model: "370Z Roadster" },
  { id: "260", brand: "Nissan", model: "GT-R Nismo" },
  { id: "261", brand: "Nissan", model: "Rogue Sport" },
  { id: "262", brand: "Nissan", model: "Xterra" },
  { id: "263", brand: "Nissan", model: "Cube" },
  { id: "264", brand: "Nissan", model: "NV300" },
  { id: "265", brand: "Nissan", model: "Navara" },
  { id: "266", brand: "Nissan", model: "Patrol" },
  { id: "267", brand: "Nissan", model: "Qashqai" },
  { id: "268", brand: "Nissan", model: "Rogue Select" },
  { id: "269", brand: "Nissan", model: "Terra" },
  { id: "270", brand: "Nissan", model: "Terrano" },
  { id: "271", brand: "Nissan", model: "Versa Note" },
  { id: "272", brand: "Nissan", model: "NV2500" },
  { id: "273", brand: "Nissan", model: "NV3500" },
  { id: "274", brand: "Nissan", model: "NV350 Urvan" },
  { id: "275", brand: "Nissan", model: "NV400" },
  { id: "276", brand: "Nissan", model: "Pulsar" },
  { id: "277", brand: "Nissan", model: "Sunny" },
  { id: "278", brand: "Nissan", model: "Tiida" },
  { id: "279", brand: "Nissan", model: "Wingroad" },
  { id: "280", brand: "Nissan", model: "Almera" },
  { id: "281", brand: "Nissan", model: "Bluebird Sylphy" },
  { id: "282", brand: "Nissan", model: "Cefiro" },
  { id: "283", brand: "Nissan", model: "Lafesta" },
  { id: "284", brand: "Nissan", model: "Latio" },
  { id: "285", brand: "Nissan", model: "Presage" },
  { id: "286", brand: "Nissan", model: "Primera" },
  { id: "287", brand: "Nissan", model: "R'nessa" },
  { id: "288", brand: "Nissan", model: "Serena" },
  { id: "289", brand: "Nissan", model: "Sylphy" },
  { id: "290", brand: "Nissan", model: "Teana" },
  { id: "291", brand: "MG", model: "3" },
  { id: "292", brand: "MG", model: "ZS" },
  { id: "293", brand: "MG", model: "HS" },
  { id: "294", brand: "MG", model: "Hector" },
  { id: "295", brand: "MG", model: "RX5" },
  { id: "296", brand: "MG", model: "RX8" },
  { id: "297", brand: "MG", model: "5" },
  { id: "298", brand: "MG", model: "6" },
  { id: "299", brand: "MG", model: "GS" },
  { id: "300", brand: "MG", model: "TF" },
  { id: "301", brand: "MG", model: "Maestro" },
  { id: "302", brand: "MG", model: "Montego" },
  { id: "303", brand: "MG", model: "Metro" },
  { id: "304", brand: "MG", model: "ZT" },
  { id: "305", brand: "MG", model: "RV8" },
  { id: "306", brand: "MG", model: "XPower SV" },
  { brand: "Mercedes-Benz", model: "A-Class" },
  { brand: "Mercedes-Benz", model: "B-Class" },
  { brand: "Mercedes-Benz", model: "C-Class" },
  { brand: "Mercedes-Benz", model: "E-Class" },
  { brand: "Mercedes-Benz", model: "S-Class" },
  { brand: "Mercedes-Benz", model: "CLA-Class" },
  { brand: "Mercedes-Benz", model: "CLS-Class" },
  { brand: "Mercedes-Benz", model: "GLA-Class" },
  { brand: "Mercedes-Benz", model: "GLB-Class" },
  { brand: "Mercedes-Benz", model: "GLC-Class" },
  { brand: "Mercedes-Benz", model: "GLE-Class" },
  { brand: "Mercedes-Benz", model: "GLS-Class" },
  { brand: "Mercedes-Benz", model: "G-Class" },
  { brand: "Mercedes-Benz", model: "SLC-Class" },
  { brand: "Mercedes-Benz", model: "SL-Class" },
  { brand: "Mercedes-Benz", model: "AMG GT" },
  { brand: "Mercedes-Benz", model: "EQC" },
  { brand: "Mercedes-Benz", model: "Metris" },
  { brand: "Mercedes-Benz", model: "Sprinter" },
  { brand: "Mercedes-Benz", model: "X-Class" },
  { brand: "Mercedes-Benz", model: "V-Class" },
  { brand: "Mercedes-Benz", model: "Maybach S-Class" },
  { brand: "Mercedes-Benz", model: "Maybach GLS" },
  { brand: "Mercedes-Benz", model: "EQS" },
  { brand: "Mercedes-Benz", model: "CLS-Class" },
  { brand: "Mercedes-Benz", model: "GLE Coupe" },
  { brand: "Mercedes-Benz", model: "GLC Coupe" },
  { brand: "Mercedes-Benz", model: "GLA Coupe" },
  { brand: "Mercedes-Benz", model: "GLB Coupe" },
];
