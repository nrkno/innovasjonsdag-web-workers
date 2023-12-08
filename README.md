# Innovasjonsdag web-workers

Kan vi forbedre ytelse av canvas-animasjon ved å avlaste hovedtråden med web workers

Laget av Skjalg Teig ved NRKs innovasjonsdager desember 2023

Videreføring av arbeidet med perfekte simplex-loops ved NRKs innovasjonsdager oktober 2023

Utledet fra [mollerse](https://github.com/mollerse/)'s gist for simplex loops https://gist.github.com/mollerse/3bcaedb67d463b8d6a6558c3dc634b30

## Nyttig info?

- [Offscreen canvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

## Hva har vi testet?

- Flytte kontroll av canvas til en webworker via `canvas.transferControlToOffscreen`
  - Håndtere alt fra en webworker
- Optimalisere slik at vi kan rendre en og en frame til et bitmap
  - Vente på at alle frames blir ferdig, så tegne -> ypperlig for en loop...
- Generere 4 og 4 frames med 4 webworkers
  - Løpe om kapp med avspilling straks man har `n` frames
  - Testet å øke antallet workers til 8 og da gikk perf rett i dass

## Observasjoner

- Vanskelig å måle konkrete verdier (FPS i devtools "ser" ikke webworkers tegning)
- Tegning til canvas via webworkers hakker litt mer enn rett på hovedtråden
  - Men det oppleves smoothere å bevege seg på siden (scrolling osv)
- Valg av nettleser er kanskje vel så sentralt for ytelse


## Fremover

- Kjører utvidet demo og retro i faggruppe for datagrafikk og kreativ koding på nyåret
  - Meld interesse og sleng deg med!

## Oppsett

Klon fra GitHub så installer dependencies fra npm og kjør lokalt med npm run dev

```sh
npm ci
npm run dev
```