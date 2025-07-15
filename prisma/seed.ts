import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.band.create({
    data: {
      name: "Legião Urbana",
      slug: "legiao-urbana",
      description:
        "Uma das bandas mais influentes do rock brasileiro, formada em Brasília em 1982. Conhecida por letras profundas e melodias marcantes.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Tempo Perdido",
            slug: "tempo-perdido",
            durationInSeconds: 315,
          },
          {
            title: "Pais e Filhos",
            slug: "pais-e-filhos",
            durationInSeconds: 328,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Beatles",
      slug: "the-beatles",
      description:
        "Banda britânica de rock formada em Liverpool em 1960, considerada a mais influente de todos os tempos.",
      status: "active",
      tracks: {
        create: [
          { title: "Hey Jude", slug: "hey-jude", durationInSeconds: 431 },
          { title: "Let It Be", slug: "let-it-be", durationInSeconds: 243 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Titãs",
      slug: "titas",
      description:
        "Banda brasileira de rock formada em São Paulo em 1982, conhecida por seus sucessos atemporais.",
      status: "active",
      tracks: {
        create: [
          { title: "Epitáfio", slug: "epitafio", durationInSeconds: 213 },
          { title: "Marvin", slug: "marvin", durationInSeconds: 254 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Queen",
      slug: "queen",
      description:
        "Banda britânica de rock formada em 1970, conhecida por seus vocais poderosos e performances energéticas.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Bohemian Rhapsody",
            slug: "bohemian-rhapsody",
            durationInSeconds: 354,
          },
          {
            title: "We Will Rock You",
            slug: "we-will-rock-you",
            durationInSeconds: 122,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Paralamas do Sucesso",
      slug: "paralamas-do-sucesso",
      description:
        "Banda brasileira de rock formada em 1977 no Rio de Janeiro, com grandes sucessos nacionais.",
      status: "active",
      tracks: {
        create: [
          { title: "Alagados", slug: "alagados", durationInSeconds: 245 },
          {
            title: "Lanterna dos Afogados",
            slug: "lanterna-dos-afogados",
            durationInSeconds: 312,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Pink Floyd",
      slug: "pink-floyd",
      description:
        "Banda britânica de rock progressivo formada em 1965, conhecida por álbuns conceituais e shows impressionantes.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Comfortably Numb",
            slug: "comfortably-numb",
            durationInSeconds: 382,
          },
          {
            title: "Wish You Were Here",
            slug: "wish-you-were-here",
            durationInSeconds: 334,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Engenheiros do Hawaii",
      slug: "engenheiros-do-hawaii",
      description:
        "Banda brasileira de rock formada em 1985 em Porto Alegre, conhecida por letras inteligentes e críticas sociais.",
      status: "active",
      tracks: {
        create: [
          { title: "Infinito", slug: "infinito", durationInSeconds: 256 },
          {
            title: "Pra Ser Sincero",
            slug: "pra-ser-sincero",
            durationInSeconds: 223,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Led Zeppelin",
      slug: "led-zeppelin",
      description:
        "Banda britânica de rock formada em 1968, uma das mais influentes da história do rock.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Stairway to Heaven",
            slug: "stairway-to-heaven",
            durationInSeconds: 482,
          },
          { title: "Kashmir", slug: "kashmir", durationInSeconds: 512 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Capital Inicial",
      slug: "capital-inicial",
      description:
        "Banda brasileira de rock formada em 1982 em Brasília, com grandes sucessos no cenário nacional.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Primeiros Erros",
            slug: "primeiros-erros",
            durationInSeconds: 234,
          },
          { title: "Fogo", slug: "fogo", durationInSeconds: 198 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Red Hot Chili Peppers",
      slug: "red-hot-chili-peppers",
      description:
        "Banda americana de rock alternativo formada em 1983, conhecida por seu estilo único e energético.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Californication",
            slug: "californication",
            durationInSeconds: 329,
          },
          {
            title: "Under the Bridge",
            slug: "under-the-bridge",
            durationInSeconds: 264,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Barão Vermelho",
      slug: "barao-vermelho",
      description:
        "Banda brasileira de rock formada em 1981 no Rio de Janeiro, com grandes sucessos nos anos 80 e 90.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Bete Balanço",
            slug: "bete-balanco",
            durationInSeconds: 245,
          },
          {
            title: "Pense e Dance",
            slug: "pense-e-dance",
            durationInSeconds: 187,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Nirvana",
      slug: "nirvana",
      description:
        "Banda americana de grunge formada em 1987, uma das mais influentes da década de 90.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Smells Like Teen Spirit",
            slug: "smells-like-teen-spirit",
            durationInSeconds: 301,
          },
          {
            title: "Come As You Are",
            slug: "come-as-you-are",
            durationInSeconds: 219,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Skank",
      slug: "skank",
      description:
        "Banda brasileira de rock/reggae formada em 1991 em Belo Horizonte, com grandes sucessos nacionais.",
      status: "active",
      tracks: {
        create: [
          { title: "Resposta", slug: "resposta", durationInSeconds: 245 },
          {
            title: "Garota Nacional",
            slug: "garota-nacional",
            durationInSeconds: 198,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Metallica",
      slug: "metallica",
      description:
        "Banda americana de heavy metal formada em 1981, uma das mais bem-sucedidas do gênero.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Enter Sandman",
            slug: "enter-sandman",
            durationInSeconds: 331,
          },
          {
            title: "Nothing Else Matters",
            slug: "nothing-else-matters",
            durationInSeconds: 388,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Charlie Brown Jr.",
      slug: "charlie-brown-jr",
      description:
        "Banda brasileira de rock formada em 1992 em Santos, conhecida por misturar rock, reggae e rap.",
      status: "active",
      tracks: {
        create: [
          { title: "Céu Azul", slug: "ceu-azul", durationInSeconds: 245 },
          {
            title: "Só os Loucos Sabem",
            slug: "so-os-loucos-sabem",
            durationInSeconds: 198,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "U2",
      slug: "u2",
      description:
        "Banda irlandesa de rock formada em 1976, conhecida por suas letras políticas e performances grandiosas.",
      status: "active",
      tracks: {
        create: [
          {
            title: "With or Without You",
            slug: "with-or-without-you",
            durationInSeconds: 296,
          },
          {
            title: "Beautiful Day",
            slug: "beautiful-day",
            durationInSeconds: 248,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Jota Quest",
      slug: "jota-quest",
      description:
        "Banda brasileira de pop rock formada em 1993 em Belo Horizonte, com grandes sucessos comerciais.",
      status: "active",
      tracks: {
        create: [
          { title: "Fácil", slug: "facil", durationInSeconds: 245 },
          { title: "Onibusfobia", slug: "onibusfobia", durationInSeconds: 198 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Guns N' Roses",
      slug: "guns-n-roses",
      description:
        "Banda americana de hard rock formada em 1985, conhecida por seus sucessos globais.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Sweet Child O' Mine",
            slug: "sweet-child-o-mine",
            durationInSeconds: 356,
          },
          {
            title: "November Rain",
            slug: "november-rain",
            durationInSeconds: 537,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Os Paralamas do Sucesso",
      slug: "os-paralamas-do-sucesso",
      description:
        "Banda brasileira de rock formada em 1977, com grandes sucessos nos anos 80 e 90.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Vital e Sua Moto",
            slug: "vital-e-sua-moto",
            durationInSeconds: 245,
          },
          { title: "Meu Erro", slug: "meu-erro", durationInSeconds: 198 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Coldplay",
      slug: "coldplay",
      description:
        "Banda britânica de rock alternativo formada em 1996, conhecida por suas baladas emocionantes.",
      status: "active",
      tracks: {
        create: [
          { title: "Yellow", slug: "yellow", durationInSeconds: 266 },
          { title: "Fix You", slug: "fix-you", durationInSeconds: 294 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Mamonas Assassinas",
      slug: "mamonas-assassinas",
      description:
        "Banda brasileira de rock cômico formada em 1995, conhecida por seu humor irreverente e sucesso meteórico.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Pelados em Santos",
            slug: "pelados-em-santos",
            durationInSeconds: 145,
          },
          { title: "Robocop Gay", slug: "robocop-gay", durationInSeconds: 198 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Rolling Stones",
      slug: "the-rolling-stones",
      description:
        "Banda britânica de rock formada em 1962, uma das mais duradouras e influentes da história.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Paint It Black",
            slug: "paint-it-black",
            durationInSeconds: 223,
          },
          { title: "Angie", slug: "angie", durationInSeconds: 274 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Cazuza",
      slug: "cazuza",
      description:
        "Cantor e compositor brasileiro, ex-vocalista do Barão Vermelho, com carreira solo de grande sucesso.",
      status: "active",
      tracks: {
        create: [
          { title: "Exagerado", slug: "exagerado", durationInSeconds: 245 },
          { title: "Brasil", slug: "brasil-cazuza", durationInSeconds: 198 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "AC/DC",
      slug: "ac-dc",
      description:
        "Banda australiana de hard rock formada em 1973, conhecida por seus riffs poderosos.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Highway to Hell",
            slug: "highway-to-hell",
            durationInSeconds: 208,
          },
          {
            title: "Back in Black",
            slug: "back-in-black",
            durationInSeconds: 255,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Kid Abelha",
      slug: "kid-abelha",
      description:
        "Banda brasileira de pop rock formada em 1981 no Rio de Janeiro, com grandes sucessos nos anos 80 e 90.",
      status: "active",
      tracks: {
        create: [
          { title: "Fixação", slug: "fixacao", durationInSeconds: 245 },
          {
            title: "Nada por Mim",
            slug: "nada-por-mim",
            durationInSeconds: 198,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Iron Maiden",
      slug: "iron-maiden",
      description:
        "Banda britânica de heavy metal formada em 1975, conhecida por suas músicas épicas e mascote Eddie.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Fear of the Dark",
            slug: "fear-of-the-dark",
            durationInSeconds: 438,
          },
          { title: "The Trooper", slug: "the-trooper", durationInSeconds: 245 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "RPM",
      slug: "rpm",
      description:
        "Banda brasileira de rock formada em 1985 em São Paulo, parte do movimento rock brasileiro dos anos 80.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Rádio Pirata",
            slug: "radio-pirata",
            durationInSeconds: 245,
          },
          {
            title: "Alvorada Voraz",
            slug: "alvorada-voraz",
            durationInSeconds: 198,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Pearl Jam",
      slug: "pearl-jam",
      description:
        "Banda americana de grunge formada em 1990, uma das mais importantes do movimento alternativo dos anos 90.",
      status: "active",
      tracks: {
        create: [
          { title: "Alive", slug: "alive", durationInSeconds: 341 },
          { title: "Black", slug: "black-pearl-jam", durationInSeconds: 348 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Raul Seixas",
      slug: "raul-seixas",
      description:
        "Cantor e compositor brasileiro, conhecido como o 'Pai do Rock Brasileiro' por sua influência no gênero.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Maluco Beleza",
            slug: "maluco-beleza",
            durationInSeconds: 245,
          },
          {
            title: "Metamorfose Ambulante",
            slug: "metamorfose-ambulante",
            durationInSeconds: 198,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Police",
      slug: "the-police",
      description:
        "Banda britânica de rock formada em 1977, conhecida por seu som new wave e reggae rock.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Every Breath You Take",
            slug: "every-breath-you-take",
            durationInSeconds: 253,
          },
          { title: "Roxanne", slug: "roxanne", durationInSeconds: 202 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Sepultura",
      slug: "sepultura",
      description:
        "Banda brasileira de heavy metal formada em 1984 em Belo Horizonte, uma das mais importantes do metal mundial.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Roots Bloody Roots",
            slug: "roots-bloody-roots",
            durationInSeconds: 195,
          },
          {
            title: "Refuse/Resist",
            slug: "refuse-resist",
            durationInSeconds: 203,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Oasis",
      slug: "oasis",
      description:
        "Banda britânica de rock formada em 1991, conhecida por seus sucessos nos anos 90 e rivalidade entre os irmãos Gallagher.",
      status: "active",
      tracks: {
        create: [
          { title: "Wonderwall", slug: "wonderwall", durationInSeconds: 258 },
          {
            title: "Don't Look Back in Anger",
            slug: "dont-look-back-in-anger",
            durationInSeconds: 287,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Los Hermanos",
      slug: "los-hermanos",
      description:
        "Banda brasileira de rock alternativo formada em 1997 no Rio de Janeiro, com letras poéticas e melodias marcantes.",
      status: "active",
      tracks: {
        create: [
          { title: "Anna Júlia", slug: "anna-julia", durationInSeconds: 245 },
          { title: "O Vento", slug: "o-vento", durationInSeconds: 198 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Radiohead",
      slug: "radiohead",
      description:
        "Banda britânica de rock alternativo formada em 1985, conhecida por sua inovação musical e álbuns aclamados.",
      status: "active",
      tracks: {
        create: [
          { title: "Creep", slug: "creep", durationInSeconds: 238 },
          {
            title: "Karma Police",
            slug: "karma-police",
            durationInSeconds: 262,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Blink-182",
      slug: "blink-182",
      description:
        "Banda americana de punk rock formada em 1992, conhecida por suas músicas energéticas e humor irreverente.",
      status: "active",
      tracks: {
        create: [
          {
            title: "All the Small Things",
            slug: "all-the-small-things",
            durationInSeconds: 167,
          },
          {
            title: "What's My Age Again?",
            slug: "whats-my-age-again",
            durationInSeconds: 182,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "System of a Down",
      slug: "system-of-a-down",
      description:
        "Banda americana de metal alternativo formada em 1994, conhecida por suas letras políticas e estilo único.",
      status: "active",
      tracks: {
        create: [
          { title: "Chop Suey!", slug: "chop-suey", durationInSeconds: 210 },
          { title: "Toxicity", slug: "toxicity", durationInSeconds: 218 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Arctic Monkeys",
      slug: "arctic-monkeys",
      description:
        "Banda britânica de indie rock formada em 2002, conhecida por seus álbuns aclamados e evolução musical.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Do I Wanna Know?",
            slug: "do-i-wanna-know",
            durationInSeconds: 272,
          },
          { title: "505", slug: "505", durationInSeconds: 253 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Foo Fighters",
      slug: "foo-fighters",
      description:
        "Banda americana de rock alternativo formada em 1994 por Dave Grohl, ex-baterista do Nirvana.",
      status: "active",
      tracks: {
        create: [
          { title: "Everlong", slug: "everlong", durationInSeconds: 250 },
          {
            title: "The Pretender",
            slug: "the-pretender",
            durationInSeconds: 269,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Strokes",
      slug: "the-strokes",
      description:
        "Banda americana de indie rock formada em 1998, uma das principais do revival do rock dos anos 2000.",
      status: "active",
      tracks: {
        create: [
          { title: "Last Nite", slug: "last-nite", durationInSeconds: 197 },
          { title: "Reptilia", slug: "reptilia", durationInSeconds: 213 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Killers",
      slug: "the-killers",
      description:
        "Banda americana de rock alternativo formada em 2001, conhecida por seus sucessos comerciais.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Mr. Brightside",
            slug: "mr-brightside",
            durationInSeconds: 223,
          },
          {
            title: "When You Were Young",
            slug: "when-you-were-young",
            durationInSeconds: 233,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Linkin Park",
      slug: "linkin-park",
      description:
        "Banda americana de rock alternativo formada em 1996, conhecida por misturar rock, metal e eletrônica.",
      status: "active",
      tracks: {
        create: [
          { title: "In the End", slug: "in-the-end", durationInSeconds: 216 },
          { title: "Numb", slug: "numb", durationInSeconds: 187 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Green Day",
      slug: "green-day",
      description:
        "Banda americana de punk rock formada em 1986, uma das mais bem-sucedidas comercialmente do gênero.",
      status: "active",
      tracks: {
        create: [
          { title: "Basket Case", slug: "basket-case", durationInSeconds: 182 },
          {
            title: "American Idiot",
            slug: "american-idiot",
            durationInSeconds: 174,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The White Stripes",
      slug: "the-white-stripes",
      description:
        "Banda americana de rock alternativo formada em 1997, conhecida por seu estilo minimalista e poderoso.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Seven Nation Army",
            slug: "seven-nation-army",
            durationInSeconds: 231,
          },
          {
            title: "Fell in Love with a Girl",
            slug: "fell-in-love-with-a-girl",
            durationInSeconds: 107,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Muse",
      slug: "muse",
      description:
        "Banda britânica de rock alternativo formada em 1994, conhecida por suas performances épicas e som grandioso.",
      status: "active",
      tracks: {
        create: [
          { title: "Uprising", slug: "uprising", durationInSeconds: 305 },
          { title: "Starlight", slug: "starlight", durationInSeconds: 240 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Black Keys",
      slug: "the-black-keys",
      description:
        "Banda americana de rock alternativo formada em 2001, conhecida por seu blues rock moderno.",
      status: "active",
      tracks: {
        create: [
          { title: "Lonely Boy", slug: "lonely-boy", durationInSeconds: 193 },
          {
            title: "Gold on the Ceiling",
            slug: "gold-on-the-ceiling",
            durationInSeconds: 223,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Arctic Monkeys 2",
      slug: "arctic-monkeys-2",
      description:
        "Banda britânica de indie rock formada em 2002, conhecida por seus álbuns aclamados e evolução musical.",
      status: "active",
      tracks: {
        create: [
          { title: "R U Mine?", slug: "r-u-mine", durationInSeconds: 201 },
          {
            title: "Fluorescent Adolescent",
            slug: "fluorescent-adolescent",
            durationInSeconds: 178,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Kings of Leon",
      slug: "kings-of-leon",
      description:
        "Banda americana de rock alternativo formada em 1999, conhecida por seus sucessos internacionais.",
      status: "active",
      tracks: {
        create: [
          { title: "Sex on Fire", slug: "sex-on-fire", durationInSeconds: 203 },
          {
            title: "Use Somebody",
            slug: "use-somebody",
            durationInSeconds: 231,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Cure",
      slug: "the-cure",
      description:
        "Banda britânica de rock alternativo formada em 1976, uma das mais importantes do pós-punk e new wave.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Friday I'm in Love",
            slug: "friday-im-in-love",
            durationInSeconds: 216,
          },
          {
            title: "Boys Don't Cry",
            slug: "boys-dont-cry",
            durationInSeconds: 178,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Who",
      slug: "the-who",
      description:
        "Banda britânica de rock formada em 1964, uma das mais influentes da história do rock.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Baba O'Riley",
            slug: "baba-oriley",
            durationInSeconds: 305,
          },
          {
            title: "My Generation",
            slug: "my-generation",
            durationInSeconds: 227,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Doors",
      slug: "the-doors",
      description:
        "Banda americana de rock formada em 1965, conhecida por suas letras poéticas e performances de Jim Morrison.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Light My Fire",
            slug: "light-my-fire",
            durationInSeconds: 428,
          },
          {
            title: "Riders on the Storm",
            slug: "riders-on-the-storm",
            durationInSeconds: 434,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Clash",
      slug: "the-clash",
      description:
        "Banda britânica de punk rock formada em 1976, conhecida como 'A Única Banda que Importa'.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Should I Stay or Should I Go",
            slug: "should-i-stay-or-should-i-go",
            durationInSeconds: 193,
          },
          {
            title: "London Calling",
            slug: "london-calling",
            durationInSeconds: 199,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Smiths",
      slug: "the-smiths",
      description:
        "Banda britânica de rock alternativo formada em 1982, conhecida por suas letras melancólicas e estilo único.",
      status: "active",
      tracks: {
        create: [
          {
            title: "There Is a Light That Never Goes Out",
            slug: "there-is-a-light-that-never-goes-out",
            durationInSeconds: 244,
          },
          {
            title: "This Charming Man",
            slug: "this-charming-man",
            durationInSeconds: 164,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Joy Division",
      slug: "joy-division",
      description:
        "Banda britânica de pós-punk formada em 1976, uma das mais influentes da história do rock alternativo.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Love Will Tear Us Apart",
            slug: "love-will-tear-us-apart",
            durationInSeconds: 238,
          },
          { title: "Disorder", slug: "disorder", durationInSeconds: 209 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "New Order",
      slug: "new-order",
      description:
        "Banda britânica de rock alternativo formada em 1980, sucessora do Joy Division com influências eletrônicas.",
      status: "active",
      tracks: {
        create: [
          { title: "Blue Monday", slug: "blue-monday", durationInSeconds: 453 },
          {
            title: "Bizarre Love Triangle",
            slug: "bizarre-love-triangle",
            durationInSeconds: 241,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Depeche Mode",
      slug: "depeche-mode",
      description:
        "Banda britânica de synth-pop formada em 1980, uma das mais influentes da música eletrônica.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Enjoy the Silence",
            slug: "enjoy-the-silence",
            durationInSeconds: 251,
          },
          {
            title: "Personal Jesus",
            slug: "personal-jesus",
            durationInSeconds: 235,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "R.E.M.",
      slug: "rem",
      description:
        "Banda americana de rock alternativo formada em 1980, uma das pioneiras do gênero.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Losing My Religion",
            slug: "losing-my-religion",
            durationInSeconds: 269,
          },
          {
            title: "Everybody Hurts",
            slug: "everybody-hurts",
            durationInSeconds: 328,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Talking Heads",
      slug: "talking-heads",
      description:
        "Banda americana de new wave formada em 1975, conhecida por seu estilo artístico e inovador.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Psycho Killer",
            slug: "psycho-killer",
            durationInSeconds: 261,
          },
          {
            title: "Once in a Lifetime",
            slug: "once-in-a-lifetime",
            durationInSeconds: 262,
          },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Pixies",
      slug: "pixies",
      description:
        "Banda americana de rock alternativo formada em 1986, influente no desenvolvimento do grunge e indie rock.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Where Is My Mind?",
            slug: "where-is-my-mind",
            durationInSeconds: 221,
          },
          { title: "Debaser", slug: "debaser", durationInSeconds: 177 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "Sonic Youth",
      slug: "sonic-youth",
      description:
        "Banda americana de rock alternativo formada em 1981, conhecida por sua experimentação e influência no noise rock.",
      status: "active",
      tracks: {
        create: [
          {
            title: "Teen Age Riot",
            slug: "teen-age-riot",
            durationInSeconds: 412,
          },
          { title: "Kool Thing", slug: "kool-thing", durationInSeconds: 288 },
        ],
      },
    },
  });

  await prisma.band.create({
    data: {
      name: "The Velvet Underground",
      slug: "the-velvet-underground",
      description:
        "Banda americana de rock formada em 1964, extremamente influente apesar do pouco sucesso comercial em sua época.",
      status: "active",
      tracks: {
        create: [
          { title: "Sweet Jane", slug: "sweet-jane", durationInSeconds: 258 },
          {
            title: "Pale Blue Eyes",
            slug: "pale-blue-eyes",
            durationInSeconds: 328,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
