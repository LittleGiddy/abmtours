export type VisitTable = {
  months: string[];
  status: string[];
  notes: { range: [number, number]; text: string }[];
};

export type Park = {
  title: string;
  description: string;
  description2: string;
  whenToVisit: string;
  activities: string[];
  gallery: string[];
  wildlife: { name: string; image: string }[];
  visitTable: VisitTable;
};

export const parkData: Record<string, Park> = {
  "serengeti-national-park": {
    title: "Serengeti National Park",
    description:
      "Serengeti is one of Africa’s most celebrated parks, known for the Great Migration and rich wildlife.",
    description2:
      "Serengeti National Park is one of Africa's most renowned safari destinations, famous for its expansive plains, rich wildlife, and the dramatic Great Migration. It is home to the Big Five—lion, leopard, elephant, buffalo, and rhino, along with large predator populations, including cheetahs, hyenas, and wild dogs. The park&apos;s annual   Great Migration sees millions of wildebeest, zebras, and gazelles moving in search of fresh grazing.",

    whenToVisit: "June to October for the best wildlife viewing.",
    activities: [
      "Wildebeest Migration",
      "Game Drive",
      "Walking Safari",
      "Bird Watching",
      "Hot Air Balloon",
      "Cultural Visits",
    ],
    gallery: [
      "/images/serengeti111.jpg",
      "/images/serengeti main.jpg",
      "/images/serengeti3.jpg",
      "/images/serengeti4.jpg",
    ],
    wildlife: [
      { name: "Lion", image: "/images/Lion2.jpg" },
      { name: "Wildebeest", image: "/images/wildbeest.jpg" },
      { name: "Zebra", image: "/images/zebra.jpg" },
      { name: "Giraffe", image: "/images/giraffe.jpg" },
      { name: "Elephant", image: "/images/elephant.jpg" },
      { name: "Hippo", image: "/images/Hippo.jpg" },
      { name: "Crocodile", image: "/images/Crocodile.jpg" },
      { name: "Zebra", image: "/images/zebra.jpg" },
      { name: "Giraffe", image: "/images/giraffe.jpg" },
      { name: "Elephant", image: "/images/elephant.jpg" },
      { name: "Lion", image: "/images/Lion2.jpg" },
      { name: "Wildebeest", image: "/images/wildbeest.jpg" },
    ],
    visitTable: {
      months: [
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
      ],
      status: [
        "BEST",
        "BEST",
        "BEST",
        "BEST",
        "BEST",
        "GOOD",
        "POOR",
        "OKAY",
        "OKAY",
        "POOR",
        "POOR",
        "POOR",
      ],
      notes: [
        { range: [0, 4], text: "Great Migration" },
        { range: [7, 8], text: "Calving Seasons" },
        { range: [5, 11], text: "The Wet Season" },
      ],
    },
  },

  "ruaha-national-park": {
    title: "Ruaha National Park",
    description:
      "Tanzania's largest, offers a rugged wilderness where lions, elephants, and rare antelope roam beneath baobab-dotted landscapes. Its remote location promises raw, crowd-free safaris along the Great Ruaha River.",
    description2:
      "Ruaha National Park is one of Tanzania’s largest and most diverse wildlife parks, spanning 20,226 square kilometers. Known for its easy accessibility and expansive landscapes, Ruaha has grown in popularity, with ongoing efforts to enhance it as a top safari destination. The park features varied terrain, from lush greenery to rocky hills, with a river flowing through its southern region. It is home to an impressive 570 bird species, attracting migratory birds from Europe, Australia, and Africa, making it a true birdwatcher’s paradise. Ruaha is also famous for its predators, boasting 10% of Africa’s lion population and the largest elephant population in Tanzania. Visitors can witness a rich variety of wildlife while enjoying the park’s tranquil yet untamed wilderness.",
    whenToVisit: "June to October for dry season game viewing.",
    activities: [
      "Walking Safaris",
      "Bird Watching",
      "Cultural Tours",
      "Night Game Drives",
    ],
    gallery: [
      "/images/ruaha1.jpg",
      "/images/ruaha2.jpg",
      "/images/ruaha3.jpg",
      "/images/ruaha4.jpg",
    ],
    wildlife: [
      { name: "Lion", image: "/images/Lion2.jpg" },
      { name: "African Wilddog", image: "/images/wilddog.jpg" },
      { name: "Zebra", image: "/images/zebra.jpg" },
      { name: "Birds", image: "/images/Bird.jpg" },
      { name: "Elephant", image: "/images/elephant.jpg" },
      { name: "Hippo", image: "/images/Hippo.jpg" },
      { name: "Crocodile", image: "/images/Crocodile.jpg" },
      { name: "Leopard", image: "/images/Leopard2.jpg" },
      { name: "Giraffe", image: "/images/giraffe.jpg" },
      { name: "Buffalo", image: "/images/Buffalo.jpg" },
      { name: "Lion", image: "/images/Lion2.jpg" },
    ],
    visitTable: {
      months: [
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
      ],
      status: [
        "BEST",
        "BEST",
        "BEST",
        "BEST",
        "BEST",
        "GOOD",
        "GOOD",
        "OKAY",
        "OKAY",
        "POOR",
        "POOR",
        "POOR",
      ],
      notes: [
        { range: [0, 4], text: "Dry, Best Game View" },
        { range: [5, 8], text: "Muddy Roads, Birds Migration" },
        { range: [9, 11], text: "Rainy Season, Difficult Access" },
      ],
    },
  },

  "ngorongoro-Conservation-area": {
    title: "Ngorongoro Conservation Area",
    description:
      "A unique blend of breathtaking scenery, Maasai culture, and one of the densest concentrations of wildlife in Africa.",
    description2:
      "The Ngorongoro Conservation Area, a UNESCO World Heritage Site, is one of Tanzania’s top wildlife and cultural destinations. At its heart lies the Ngorongoro Crater, a vast volcanic caldera teeming with wildlife, including the Big Five—lion, elephant, buffalo, leopard, and rhino. Its enclosed ecosystem makes it one of the most densely populated wildlife areas in the world. Beyond its rich biodiversity, the area is home to the Maasai people, who maintain their traditional semi-nomadic lifestyle. Visitors can experience their culture through village visits and guided tours. The conservation area also includes Olduvai Gorge, a globally significant archaeological site where fossil discoveries have provided key insights into early human evolution.",

    whenToVisit:
      "June to October is best for hiking; avoid heavy rains in March-May.",
    activities: [
      "Game Drive",
      "Walking Safari",
      "Archeological Sites",
      "Cultural Visits",
      
    ],
    gallery: [
      "/images/ngorongoro.jpg",
      "/images/ngorongoro2.jpg",
      "/images/ngorongoro3.jpg",
      "/images/ngorongoro4.jpg",
    ],
    wildlife: [
      { name: "Lion", image: "/images/Lion2.jpg" },
      { name: "Thomson's Gazelle", image: "/images/Gazelle.jpg" },
      { name: "Zebra", image: "/images/zebra.jpg" },
      { name: "Spotted Hyena", image: "/images/Hyena.jpg" },
      { name: "Elephant", image: "/images/elephant.jpg" },
      { name: "Hippo", image: "/images/Hippo.jpg" },
      { name: "Black Rhino", image: "/images/BlackRhino.jpg" },
      { name: "Leopard", image: "/images/Leopard2.jpg" },
      { name: "Birds", image: "/images/Bird.jpg" },
      { name: "Buffalo", image: "/images/Buffalo.jpg" },
      { name: "Cheetah", image: "/images/Cheetah.jpg" },
      { name: "Wildebeest", image: "/images/wildbeest.jpg" },
    ],
    visitTable: {
      months: [
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
      ],
      status: [
        "BEST",
        "BEST",
        "BEST",
        "BEST",
        "GOOD",
        "GOOD",
        "OKAY",
        "OKAY",
        "OKAY",
        "POOR",
        "POOR",
        "POOR",
      ],
      notes: [
        { range: [0, 3], text: "Wildlife Viewing (Dry Seasons)" },
        { range: [0, 1], text: "Migration" },
        { range: [7, 8], text: "Calving Season" },
        { range: [9, 11], text: "Avoiding Crowds (Wet Seasons)" },
        
      ],
    },
  },

  "ngorongoro-conservation-area": {
    title: "Ngorongoro Conservation Area",
    description:
      "A UNESCO World Heritage Site featuring the stunning Ngorongoro Crater and rich Maasai culture.",
    description2: "",
    whenToVisit: "June to October is best, but wildlife is present all year.",
    activities: [
      "Crater Safari",
      "Cultural Visits",
      "Walking Safaris",
      "Archaeological Sites",
    ],
    gallery: [
      "/images/ngorongoro1.jpg",
      "/images/ngorongoro2.jpg",
      "/images/ngorongoro3.jpg",
      "/images/ngorongoro4.jpg",
    ],
    wildlife: [
      { name: "Rhino", image: "/images/rhino.jpg" },
      { name: "Lion", image: "/images/lion.jpg" },
      { name: "Hippo", image: "/images/hippo.jpg" },
      { name: "Elephant", image: "/images/elephant.jpg" },
      { name: "Flamingo", image: "/images/flamingo.jpg" },
    ],
    visitTable: {
      months: [
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
      ],
      status: [
        "BEST",
        "BEST",
        "BEST",
        "BEST",
        "GOOD",
        "GOOD",
        "GOOD",
        "GOOD",
        "OKAY",
        "POOR",
        "POOR",
        "POOR",
      ],
      notes: [
        { range: [0, 3], text: "Cool & Dry, Perfect Visibility" },
        { range: [4, 7], text: "Mild Rains, Still Good Access" },
        { range: [8, 11], text: "Heavier Rains, Slippery Trails" },
      ],
    },
  },
};
