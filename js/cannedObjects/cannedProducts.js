/**
 * Created with IntelliJ IDEA.
 * User: bbhagan
 * Date: 6/26/13
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */

var cannedProducts = {

 "products":[{"id":"0","name":"Round Bean Bag Chair in Brown/Turquoise","price":"$123.81","desc":"","type":"p","numPeople":"51","likes":"22","ageRange":{"min":"8","max":"17"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/51de0MHkzzL.jpg","altIMG":["","",""]},{"id":"1","name":"Daily Day Planner Organizer Fashion Agenda","price":"$11.95","desc":"Monthly \"Plan ahead\" Spread at the Beginning of each Month Including Inspired Thoughts and Words of Wisdom from Prominent Women  Weekly View Planner Pages With Lots Of Writing Space  2013 & 2014 \"Year At A Glance\" Printed on the Inside Covers  Personal Info Page, Class Scheduler Pages, 9 Notes Pages, Reason for a Party List and Yearly Goals Page  Holidays and Daylight Savings Time Integrated into the Calendar Section - Special Icons on Holidays","type":"p","numPeople":"47","likes":"35","ageRange":{"min":"13","max":"17"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/51bn216r67L._SX38_SY50_CR,0,0,38,50_.jpg","altIMG":["http://ecx.images-amazon.com/images/I/51m%2Bzs2RORL._SX38_SY50_CR,0,0,38,50_.jpg","http://ecx.images-amazon.com/images/I/51pmwUxUOvL._SX38_SY50_CR,0,0,38,50_.jpg","http://ecx.images-amazon.com/images/I/611Byf-n9UL._SX38_SY50_CR,0,0,38,50_.jpg"]},{"id":"2","name":"Aeropostale Gift Card","price":"$25.00","desc":"A87 Gift Card $25 value","type":"p","numPeople":"85","likes":"17","ageRange":{"min":"10","max":"17"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/31amoYg-f6L.jpg","altIMG":["","",""]},{"id":"3","name":"American Eagle Gift Card","price":"$25.00","desc":"$25 value gift card","type":"p","numPeople":"93","likes":"24","ageRange":{"min":"10","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/31NcBbyC25L.jpg","altIMG":["","",""]},{"id":"4","name":"Apple iPad 2 (16GB, Wifi, White)","price":"$415.48","desc":"Apple's 2nd generation of iPads.  9.7-inch (diagonal) LED-backlit glossy widescreen Multi-Touch display with IPS technology.  1 GHz dual-core Apple A5 custom-designed processor.  Forward facing and rear facing cameras.","type":"p","numPeople":"120","likes":"234","ageRange":{"min":"8","max":"18"},"gender":"b","imgURL":"http://ecx.images-amazon.com/images/I/41xolv8eXoL.jpg","altIMG":["","",""]},{"id":"5","name":"Apple iPhone 4S 16GB (White)","price":"$539.99","desc":"iPhone 4S  Size 16 GB","type":"p","numPeople":"55","likes":"95","ageRange":{"min":"10","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/41ua5HiV45L._SX385_.jpg","altIMG":["","",""]},{"id":"6","name":"Apple iPod Touch","price":"$189.99","desc":"It has 8 GB capacity for about 2,000 songs, 10,000 photos, or 10 hours of video  It has up to 40 hours of audio playback or 7 hours of video playback on a single charge  Display: 960 x 640 Pixel Resolution,It has one-year limited warranty  VGA-quality photos and video up to 30 frames per second with the front camera","type":"p","numPeople":"240","likes":"433","ageRange":{"min":"6","max":"11"},"gender":"b","imgURL":"http://ecx.images-amazon.com/images/I/41I7wnu9WfL._SX385_.jpg","altIMG":["http://ecx.images-amazon.com/images/I/61HFAHI3JWL._SX385_.jpg","http://ecx.images-amazon.com/images/I/41kg-JgmVZL._SX38_SY50_CR,0,0,38,50_.jpg",""]},{"id":"7","name":"Body Shop Pink Grapefruit Shower Gel 8.4 Oz.","price":"$12.99","desc":"This soap-free shower gel contains real pink grapefruit seed oil and has a refreshing citrus scent  Lather-rich","type":"p","numPeople":"57","likes":"63","ageRange":{"min":"13","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/41p9rtDoMlL.jpg","altIMG":["","",""]},{"id":"8","name":"Catching Fire (The Second Book of the Hunger Games)","price":"","desc":"Hardcover edition Against all odds, Katniss Everdeen has won the annual Hunger Games with fellow district tribute Peeta Mellark. But it was a victory won by defiance of the Capitol and their harsh rules. Katniss and Peeta should be happy. After all, they have just won for themselves and their families a life of safety and plenty. But there are rumors of rebellion among the subjects, and Katniss and Peeta, to their horror, are the faces of that rebellion. The Capitol is angry. The Capitol wants revenge.","type":"p","numPeople":"59","likes":"75","ageRange":{"min":"9","max":"16"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/51dxiVSpLwL._SY346_PJlook-inside-v2,TopRight,1,0_SH20_.jpg","altIMG":["","",""]},{"id":"9","name":"China Glaze Sugar High #80931","price":"$4.30","desc":"China Glaze Nail Lacquer with Hardener","type":"p","numPeople":"51","likes":"53","ageRange":{"min":"11","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/31TnJko7SoL.jpg","altIMG":["","",""]},{"id":"10","name":"EOS Lip Balm Strawberry Sorbet .25 oz","price":"$6.99","desc":"Can a lip balm make you smile? EOS thinks so.","type":"p","numPeople":"78","likes":"89","ageRange":{"min":"10","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/31Y3LAI0sHL._SS40_.jpg","altIMG":["http://ecx.images-amazon.com/images/I/31DrZc4NVML._SS40_.jpg","http://ecx.images-amazon.com/images/I/41lmbQGlBcL._SS40_.jpg",""]},{"id":"11","name":"Essie LuxEffects Top Coats","price":"$5.85","desc":"Chip resistant formula  Gives long lasting manicures  Quick drying on nails","type":"p","numPeople":"91","likes":"103","ageRange":{"min":"12","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/31RfER0pzfL._AA160_.jpg","altIMG":["http://ecx.images-amazon.com/images/I/51jogIPS63L._SS40_.jpg","http://ecx.images-amazon.com/images/I/41-AbLCu6rL._SS40_.jpg",""]},{"id":"12","name":"Glow in the Dark Neon Nail Polish (6 Pack)","price":"$6.75","desc":"6 COLORS GLOW IN THE DARK NEON NAIL POLISH  Available in a set of hot pink,yellow,green,orange purple and blue  Also available in a set of hot pink,pink,yellow, purple,green and orange","type":"p","numPeople":"53","likes":"76","ageRange":{"min":"12","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/41N%2BMCQqxkL._SS40_.jpg","altIMG":["http://ecx.images-amazon.com/images/I/412g%2Bv2NTOL._SS40_.jpg","",""]},{"id":"13","name":"Harry Potter and the Half-Blood Prince (Book 6)","price":"","desc":"The war against Voldemort is not going well; even the Muggles have been affected. Dumbledore is absent from Hogwarts for long stretches of time, and the Order of the Phoenix has already suffered losses.   And yet . . . as with all wars, life goes on. Sixth-year students learn to Apparate. Teenagers flirt and fight and fall in love. Harry receives some extraordinary help in Potions from the mysterious Half-Blood Prince. And with Dumbledore's guidance, he seeks out the full, complex story of the boy who became Lord Voldemort -- and thus finds what may be his only vulnerability.","type":"p","numPeople":"39","likes":"48","ageRange":{"min":"8","max":"15"},"gender":"b","imgURL":"http://ecx.images-amazon.com/images/I/51NbOxBO%2BBL._SY346_.jpg","altIMG":["","",""]},{"id":"14","name":"Just Dance 4","price":"$19.99","desc":"Top Of The Charts - Just Dance 4 has over 40 all-new songs, ranging from current Billboard hits, legendary favorites, and classic dance party tracks!  Just Dance-Off! - Challenge your friends in 6 rounds of dance battles with the all-new battle mode!  Bring Your Crew - Each player can get his own moment of fame with unique choreographies and moves for each member of your dance crew.  Just Sweat It Out - The popular Just Sweat mode gets a major upgrade with brand new workout sessions, personalized programs, live feedbacks and a real calorie counter.","type":"p","numPeople":"99","likes":"115","ageRange":{"min":"8","max":"18"},"gender":"f","imgURL":"http://ecx.images-amazon.com/images/I/61QeP8ApfBL.jpg","altIMG":["http://ecx.images-amazon.com/images/I/51QEChHI5EL._SX38_SY50_CR,0,0,38,50_.jpg","http://ecx.images-amazon.com/images/I/51liHwwOFqL._SX38_SY50_CR,0,0,38,50_.jpg",""]}]




   /*
   products: [
      {
         id:0,
         type:'p',
         name:'Apple iPod touch 32GB',
         price: 274.99,
         imgURL: 'http://ecx.images-amazon.com/images/I/711Ff5iFXDL._SL1500_.jpg',
         altIMG: ['http://ecx.images-amazon.com/images/I/51A9Cgfy9WL.jpg', 'http://ecx.images-amazon.com/images/I/412kVB1ADkL.jpg', 'http://ecx.images-amazon.com/images/I/51t0Ma3WRBL.jpg'],
         desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in.',
         likes: 5,
         numPeople: 659,
         ageRange: {
            min: 6,
            max: 18
         },
         gender: 'b'
      },
      {
         id:1,
         type:'c',
         name:'$10 to World Wildlife Foundation',
         price: 10.00,
         imgURL: 'http://worldwildlife.org/assets/structure/unique/logo.png',
         altIMG: [],
         desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in.',
         likes: 22,
         numPeople: 329,
         ageRange: {
            min: 3,
            max: 18
         },
         gender: 'b'
      },
      {
         id:2,
         type:'s',
         name:'$50 US Savings Bond',
         price: 50.00,
         imgURL: 'http://knoji.com/images/user/ibond.jpg',
         altIMG: [],
         desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec in.',
         likes: 18,
         numPeople: 865,
         ageRange: {
            min: 8,
            max: 18
         },
         gender: 'b'
      }
   ]
   */
};
