# wa_vjezbe_05 — Pizza Express

Samostalni zadatak za vježbu 5 iz kolegija "Web aplikacije"; nadogradnja na samostalni zadatak za vjezbu 3 iz istog kolegija.  
Aplikacija omogućuje pregled, pretragu i naručivanje pizza te pohranu podataka u MongoDB Atlas.

---

## Struktura projekta

Projekt je podijeljen u dva direktorija:

1. **Frontend** — `pizza-vue` (Vue 3 + Vite aplikacija)
2. **Backend** — `pizza-express/` (Express.js API povezan na MongoDB Atlas)

Ova podjela omogućava odvojeni razvoj i komunikaciju preko REST API-ja.

---

## Backend Instalacija i pokretanje

1. Otvorite terminal i idite u backend direktorij:

```bash
cd pizza-express
npm install
node index.js
```

Backend radi na: http://localhost:3000

## Frontend Instalacija i pokretanje

1. Otvorite terminal i idite u frontend direktorij:

```bash
cd pizza-vue
npm install
npm run dev
```

Frontend radi na: http://localhost:5173

## Pokretanje aplikacije:

Otvorite: http://localhost:5173

## API rute

### Pizze

GET /pizze
GET /pizze/:naziv
POST /pizze

### Narudzbe

POST /narudzba

## Tehnologije

Vue 3, Vite, Tailwind, Express, Node.js, MongoDB Atlas, MongoDB Node.js driver

## MongoDB konfiguracija

Za konfiguraciju trebate u direktoriju pizza-express/ kreirati .env datoteku sa sljedećim varijablama:

```
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_URL>/?retryWrites=true&w=majority
MONGO_DB_NAME=pizza_db
```

## Postman link

https://www.postman.com/mmartan-3473015/workspace/wa5/collection/49626233-a94a985a-57dd-44d6-b820-2e10a562fbe7?action=share&creator=49626233
