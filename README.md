# Tamplr

Web-ohjelmoinnin harjoitustyö keväällä 2015.

[Harjoitustyön tehtävänanto on täällä](http://www.cs.tut.fi/~seitti/2015/harjoitustyot/tamplr.html).


## Tekijät

* Ryhmä X
    * Yyy Yyy, NNNNNN
    * Zzz Zzz, NNNNNN


## Kysyttävää?

Paras tapa harjoitustyöhön liittyvien kysymysten esittämiseen on
[luoda uusi *issue* harjoitustyöpohjan repositorioon](https://gitlab.rd.tut.fi/tie-23500_2014-2015/template_project/issues)
(tai kommentoida olemassaolevaa).
Kurssihenkilökunta seurailee tätä ja vastailee kysymyksiin.


Jos esimerkiksi kehitysympäristön asentamisessa on ongelmia, tehtävänannossa epäselvyyksiä tai mitä tahansa muuta harjoitustyöhön liittyvää, kysymykset ovat tervetulleita.
Myös tyhmät kysymykset on sallittuja.
Samoin muiden kysymyksiin vastaaminen.


## Kehitysympäristö

[Ohjeita kehitysympäristön pystytykseen, sovelluksen suoritukseen ja Herokun käyttöön on täällä.](http://www.cs.tut.fi/~seitti/2015/harjoitustyot/pystytys.html)


## Repositorion sisältö

Tämä harjoitustyöpohja on luotu käyttämällä
[express-generator:ia](http://expressjs.com/starter/generator.html),
lisäämällä siihen [Sequelize](http://sequelizejs.com/)-kirjasto suunnilleen
[tässä tutoriaalissa](http://sequelizejs.com/articles/express) esitetyllä tavalla
sekä tekemällä siihen päälle muutama pikkusäätö.

Seuraavassa pieni kuvaus pohjassa olevista tiedostoista.
Kaikkia tiedostoja saa vapaasti muokata.

#### package.json
[npm](https://www.npmjs.com/)-paketinhallinnan konfiguuraatio.
Voit asentaa uusia npm-paketteja joko muokkaamalla tätä tiedostoa tai ehkä parempi tapa on suorittaa

```sh
npm install PAKETIN_NIMI --save
```

#### Procfile
[Heroku](https://www.heroku.com/)-konfiguraatio.
Tätä ei luultavasti tarvitse muokata.

#### app.js
"Pääohjelma".

#### models/
[Sequelize](http://sequelizejs.com/)-tietomallit.
Tiedosto `models/index.js` luo yhteyden tietokantaan
ja lataa kaikki mallit tästä kansiosta.

Voit luoda uusia tietomalleja luomalla uusia tiedostoja
olemassaolevan `user.js` lisäksi.

#### routes/
Express:in reitit.
Tiedostossa `app.js` asetetaan tietty polku osoittamaan tiettyyn `routes/`-kansiossa olevaan tiedostoon, jolloin
ko. polkuun kohdistuvat HTTP-pyynnöt ohjautuvat tälle.

#### views/
Näkymät. Käyttävät oletuksena
[ejs](http://www.embeddedjs.com/)-sivupohjamoottoria.

#### public/
Kansio staattisille CSS-, JavaScript-, ym. tiedostoille.
Nämä web-palvelin tarjoilee sellaisenaan.

#### bin/
Tässä kansiossa on pari skriptiä, joita ei luultavasti tarvitse muokata.

* `bin/www` on sovelluksen käynnistysskripti.
Sen voi suorittaa myös komennolla `npm start`.
* `bin/reset-dbs` on skripti tietokantojen alustukseen.
Kun muutat jotain Sequelizen mallia,
jota vastaava taulu on jo tietokannassa,
täytyy tämä skripti ajaa.
Vasta tällöin muutokset tulevat voimaan.
Tyhjentää samalla tietokannan.

#### Vagrantfile ja bootstrap.sh
Vagrant-ympäristön konfiguraatio.



