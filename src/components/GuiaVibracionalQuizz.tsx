import { useEffect, useRef } from "react";

/*
 * Componente do Quiz "Guía Vibracional".
 *
 * O HTML e o CSS são mantidos idênticos ao arquivo original
 * (public/guia-vibracional-quizz.html). O markup é injetado via
 * dangerouslySetInnerHTML e a lógica original (que era um IIFE) foi
 * portada para o useEffect abaixo, operando sobre o elemento montado.
 */

const QUIZ_CSS = `
#frequency-quiz,
#frequency-quiz * {
  box-sizing: border-box;
}

#frequency-quiz {
  --fq-background: #e0e6f4;
  --fq-gold: #ddb22c;
  --fq-light-gold: #deca86;
  --fq-dark: #3a3a3a;
  --fq-back: #de8282;

  position: relative;
  width: 100vw;
  max-width: none;
  min-height: 100vh;
  min-height: 100svh;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  background: var(--fq-background);
  color: #111;
  font-family: "Sora", sans-serif;
  line-height: 1.35;
}

#frequency-quiz button,
#frequency-quiz input {
  font-family: "Sora", sans-serif;
}

#frequency-quiz button {
  -webkit-tap-highlight-color: transparent;
}

/* BARRA SUPERIOR */

.fq-top-progress {
 position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100%;
  height: 9px;
  overflow: hidden;
  background: #3a3a3a;
}

.fq-top-progress-fill {
  height: 100%;
  border-radius: 0 10px 10px 0;
  background: #ddb22c;
  transition: width 0.45s ease;
}

/* ESTRUTURA DAS ETAPAS */

.fq-stage {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  visibility: hidden;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 45px 20px 30px;
  overflow-x: hidden;
  overflow-y: auto;
  opacity: 0;
  transform: translateY(8px);

  transition:
    opacity 0.28s ease,
    transform 0.28s ease,
    visibility 0.28s ease;
}

.fq-stage.is-active {
  z-index: 2;
  visibility: visible;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.fq-stage-intro {
  align-items: flex-start;
  padding-top: 100px;
}

.fq-intro-content,
.fq-standard-content {
  width: 100%;
  text-align: center;
}

.fq-intro-content {
  max-width: 560px;
}

.fq-standard-content {
  max-width: 620px;
}

.fq-question {
  margin: 0 0 27px;
  color: #111;
  font-size: 18px !important;
  font-weight: 600 !important;
}

/* INTRODU&Ccedil;&Atilde;O */

.fq-intro-title {
  max-width: 550px;
  margin: 0 auto 28px;
  color: #111;
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 1.32;
  text-align: center;
}

.fq-intro-title span {
  display: inline-block;
  padding: 0 7px 1px;
  background: #f7d957;
}

.fq-warning {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 74px;
  margin: 0 auto 28px;
  padding: 15px 21px;
  border-radius: 9px;
  background: #fff3cd;
  color: #805a00;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.45;
  text-align: left;
}

.fq-warning-icon {
  flex: 0 0 auto;
  margin-right: 15px;
  font-size: 21px;
}

.fq-gender-question {
  margin-bottom: 27px;
}

.fq-gender-grid {
  display: grid;
  grid-template-columns: repeat(2, 230px);
  justify-content: center;
  gap: 25px;
}

.fq-gender-card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 230px;
  height: 325px;
  padding: 0;
  overflow: hidden;
  border: 0;
  border-radius: 8px;
  background: var(--fq-gold);
  cursor: pointer;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.fq-gender-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.13);
}

.fq-gender-card img {
  display: block;
  width: 100%;
  height: 269px;
  object-fit: cover;
  object-position: center;
}

.fq-gender-label {
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  padding: 0 18px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  text-align: left;
}

.fq-privacy {
  margin-top: 36px;
  color: #333;
  font-size: 14px;
  font-weight: 400;
}

.fq-privacy-main {
  display: grid;
  grid-template-columns: 35px 145px 1fr;
  align-items: center;
  text-align: center;
}

.fq-privacy-main strong {
  font-size: 14px;
  line-height: 1.5;
}

.fq-privacy-main span {
  line-height: 1.55;
}

.fq-lock {
  font-size: 15px;
}

.fq-privacy p {
  margin: 10px 0 0;
  line-height: 1.45;
}

/* BOT&Otilde;ES BRANCOS */

.fq-white-option {
  min-height: 46px;
  padding: 8px 10px;
  border: 0;
  border-bottom: 2px solid var(--fq-gold);
  border-radius: 5px 5px 2px 2px;
  background: #f8f8f8;
  color: #050505;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.fq-white-option:hover {
  z-index: 2;
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 5px 11px rgba(0, 0, 0, 0.09);
}

.fq-month-grid {
  display: grid;
  grid-template-columns: repeat(4, 128px);
  justify-content: center;
  gap: 10px;
}

.fq-day-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 586px;
  max-width: 100%;
  margin: 0 auto;
  gap: 7px;
}

.fq-day-grid .fq-white-option {
  width: 46px;
  min-width: 46px;
  padding-right: 3px;
  padding-left: 3px;
  font-size: 18px;
}

.fq-decade-grid {
  display: grid;
  grid-template-columns: repeat(4, 126px);
  justify-content: center;
  gap: 10px;
}

.fq-decade-grid .fq-white-option:nth-child(9) {
  grid-column: 2;
}

.fq-year-grid {
  display: grid;
  grid-template-columns: repeat(5, 101px);
  justify-content: center;
  gap: 8px;
}

.fq-year-grid .fq-white-option {
  font-size: 16px;
}

.fq-back {
  min-width: 132px;
  min-height: 35px;
  margin-top: 19px;
  padding: 8px 24px;
  border: 0;
  border-radius: 9px;
  background: var(--fq-back);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
}

.fq-back:hover {
  filter: brightness(0.95);
  transform: translateY(-1px);
}

/* ESTADO CIVIL E DESAFIO */

.fq-card-step {
  max-width: 615px;
}

.fq-gold-heading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 615px;
  max-width: 100%;
  min-height: 49px;
  margin: 0 auto 30px;
  padding: 8px 20px;
  border-radius: 14px;
  background: var(--fq-gold);
  color: #fff !important;
  font-size: 34px !important;
  font-weight: 600 !important;
  line-height: 1.05;
}

.fq-marital-grid {
  display: grid;
  grid-template-columns: repeat(3, 176px);
  justify-content: center;
  gap: 21px 22px;
}

.fq-large-card,
.fq-challenge-card {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: 2px solid var(--fq-gold);
  background: var(--fq-light-gold);
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    filter 0.2s ease,
    box-shadow 0.2s ease;
}

.fq-large-card {
  width: 176px;
  height: 152px;
  border-radius: 15px;
}

.fq-large-card:hover,
.fq-challenge-card:hover {
  z-index: 2;
  filter: brightness(1.03);
  transform: translateY(-3px);
  box-shadow: 0 8px 17px rgba(0, 0, 0, 0.12);
}

.fq-large-card svg {
  width: 51px;
  height: 51px;
  margin-bottom: 15px;
  stroke-width: 1.6;
}

.fq-large-card span {
  font-size: 17px;
  font-weight: 700;
}

.fq-challenge-heading {
  min-height: 77px;
  margin-bottom: 27px;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 29px;
}

.fq-challenge-grid {
  display: grid;
  grid-template-columns: repeat(2, 212px);
  justify-content: center;
  gap: 17px 27px;
}

.fq-challenge-card {
  width: 212px;
  height: 115px;
  border-radius: 15px;
}

.fq-challenge-card svg {
  width: 52px;
  height: 52px;
  margin-bottom: 2px;
  stroke-width: 1.6;
}

.fq-challenge-card span {
  font-size: 14px;
  font-weight: 700;
}

/* NOME */

.fq-name-content {
  max-width: 500px;
}

.fq-name-content .fq-question {
  margin-bottom: 28px;
}

.fq-name-input {
  display: block;
  width: 330px;
  max-width: 100%;
  height: 59px;
  margin: 0 auto;
  padding: 0 21px;
  border: 0;
  border-radius: 7px;
  outline: none;
  background: #fff;
  color: #222;
  font-size: 17px;
  font-weight: 400;
  box-shadow: 0 2px 9px rgba(0, 0, 0, 0.17);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.fq-name-input::placeholder {
  color: #8f949d;
  opacity: 1;
}

.fq-name-input:focus {
  transform: translateY(-1px);
  box-shadow:
    0 0 0 3px rgba(221, 178, 44, 0.22),
    0 3px 12px rgba(0, 0, 0, 0.18);
}

.fq-name-submit {
  display: block;
  width: 368px;
  max-width: 100%;
  min-height: 50px;
  margin: 28px auto 0;
  padding: 10px 20px;
  border: 0;
  border-radius: 30px;
  background: linear-gradient(90deg, #ffd73d 0%, #c49a00 100%);
  color: #fff;
  font-size: 21px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 7px 12px rgba(65, 138, 55, 0.25);
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
}

.fq-name-submit:hover {
  filter: brightness(1.04);
  transform: translateY(-2px);
}

.fq-name-error {
  display: none;
  margin-top: 10px;
  color: #bf3434;
  font-size: 13px;
  font-weight: 600;
}

.fq-name-error.is-visible {
  display: block;
}

/* FUNDO ESCURO */

.fq-dark-stage {
  color: #fff;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.8)),
    url("/img/bg_divino.webp");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

/* CARREGAMENTO */

.fq-loading-content {
  width: 100%;
  max-width: 520px;
  text-align: center;
}

.fq-loading-content h2 {
  margin: 0 0 13px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
}

.fq-loading-bar {
  width: 265px;
  max-width: 80%;
  height: 27px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 30px;
  background: #fff;
}

.fq-loading-fill {
  width: 0;
  height: 100%;
  border-radius: 30px;
  background: linear-gradient(90deg, #fbd751 0%, #c49a08 100%);
}

.fq-loading-stage.is-loading .fq-loading-fill {
  width: 100%;
  transition: width 5s linear;
}

/* TELA FINAL */

.fq-final-stage {
  padding: 38px 20px;
}

.fq-final-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 935px;
  max-width: 100%;
  min-height: 620px;
  padding: 40px 25px 28px;
  border: 2px solid rgba(221, 178, 44, 0.28);
  background: rgba(0, 0, 0, 0.4);
  text-align: center;
}

.fq-final-title {
  margin: 0 0 18px;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
}

.fq-final-title span {
  color: #f3cb38;
}

.fq-stop-image {
  display: block;
  width: 205px;
  max-width: 50vw;
  height: auto;
  margin: 0 auto 17px;
}

.fq-final-message {
  margin: 0 0 47px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
}

.fq-final-button {
  width: 246px;
  min-height: 53px;
  padding: 10px 25px;
  border: 0;
  border-radius: 30px;
  background: #12b80b;
  color: #fff;
  font-size: 21px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  animation: fqPulse 1.3s ease-in-out infinite;
  transition:
    filter 0.2s ease,
    transform 0.2s ease;
}

.fq-final-button:hover {
  filter: brightness(1.08);
}

@keyframes fqPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(18, 184, 11, 0.4);
  }

  50% {
    transform: scale(1.04);
    box-shadow: 0 0 0 12px rgba(18, 184, 11, 0);
  }
}

/* TABLET */

@media (max-width: 767px) {
  #frequency-quiz {
    min-height: 100svh;
  }

  .fq-stage {
    padding: 55px 15px 30px;
  }

  .fq-stage-intro {
    padding-top: 65px;
  }

  .fq-intro-title {
    font-size: 16px;
  }

  .fq-warning {
    padding: 14px 15px;
    font-size: 13px;
  }

  .fq-question {
    font-size: 15px;
  }

  .fq-gender-grid {
    grid-template-columns: repeat(2, minmax(0, 170px));
    gap: 12px;
  }

  .fq-gender-card {
    width: 100%;
    height: 278px;
  }

  .fq-gender-card img {
    height: 227px;
  }

  .fq-gender-label {
    height: 51px;
    padding: 0 12px;
    font-size: 15px;
  }

  .fq-privacy {
    margin-top: 27px;
    font-size: 12px;
  }

  .fq-privacy-main {
    grid-template-columns: 25px 110px 1fr;
  }

  .fq-privacy-main strong {
    font-size: 12px;
  }

  .fq-desktop-break {
    display: none;
  }

  .fq-month-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }

  .fq-month-grid .fq-white-option {
    padding-right: 3px;
    padding-left: 3px;
    font-size: 12px;
  }

  .fq-day-grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    width: 100%;
    gap: 7px;
  }

  .fq-day-grid .fq-white-option {
    width: auto;
    min-width: 0;
    font-size: 15px;
  }

  .fq-decade-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .fq-decade-grid .fq-white-option:nth-child(9) {
    grid-column: auto;
  }

  .fq-year-grid {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  .fq-year-grid .fq-white-option {
    padding-right: 3px;
    padding-left: 3px;
    font-size: 13px;
  }

  .fq-gold-heading {
    min-height: 48px;
    margin-bottom: 22px;
    border-radius: 10px;
    font-size: 21px;
  }

  .fq-challenge-heading {
    min-height: 68px;
    font-size: 19px;
  }

  .fq-marital-grid {
    grid-template-columns: repeat(2, minmax(0, 176px));
    gap: 12px;
  }

  .fq-large-card {
    width: 100%;
    height: 130px;
  }

  .fq-large-card svg {
    width: 43px;
    height: 43px;
    margin-bottom: 10px;
  }

  .fq-large-card span {
    font-size: 14px;
  }

  .fq-challenge-grid {
    grid-template-columns: repeat(2, minmax(0, 212px));
    gap: 12px;
  }

  .fq-challenge-card {
    width: 100%;
    height: 108px;
  }

  .fq-name-submit {
    font-size: 17px;
  }

  .fq-loading-content h2 {
    font-size: 18px;
  }

  .fq-final-stage {
    padding: 25px 13px;
  }

  .fq-final-box {
    min-height: calc(100svh - 50px);
    padding: 35px 15px;
  }

  .fq-final-title {
    font-size: 18px;
  }

  .fq-stop-image {
    width: 175px;
  }

  .fq-final-message {
    margin-bottom: 35px;
    font-size: 15px;
  }
}

/* CELULARES MENORES */

@media (max-width: 420px) {
  .fq-stage-intro {
    padding-top: 48px;
  }

  .fq-intro-title {
    margin-bottom: 18px;
    font-size: 14px;
  }

  .fq-warning {
    min-height: auto;
    margin-bottom: 20px;
  }

  .fq-gender-question {
    margin-bottom: 18px;
  }

  .fq-gender-card {
    height: 245px;
  }

  .fq-gender-card img {
    height: 199px;
  }

  .fq-gender-label {
    height: 46px;
    font-size: 13px;
  }

  .fq-privacy {
    margin-top: 20px;
  }

  .fq-privacy-main {
    grid-template-columns: 22px 95px 1fr;
  }

  .fq-month-grid .fq-white-option {
    font-size: 10px;
  }

  .fq-white-option {
    min-height: 43px;
  }

  .fq-marital-grid {
    gap: 9px;
  }

  .fq-large-card {
    height: 118px;
  }

  .fq-large-card span {
    font-size: 12px;
  }

  .fq-challenge-card span {
    font-size: 12px;
  }
}

#fq-final-intro {
  width: 100%;
  text-align: center;
}

#fq-vsl-area {
  display: none;
  width: 100%;
  text-align: center;
}

#fq-vsl-area.is-visible {
  display: block;
}

.fq-final-box.is-video-active {
  justify-content: flex-start;
  min-height: auto;
  padding-top: 25px;
  padding-bottom: 45px;
}

.fq-buy-button {
  display: none;
  width: 280px;
  max-width: 100%;
  min-height: 56px;
  margin: 28px auto 0;
  padding: 14px 25px;
  border-radius: 30px;
  background: #12b80b;
  color: #ffffff !important;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  text-align: center;
  text-decoration: none !important;
  animation: fqBuyPulse 1.3s ease-in-out infinite;
}

.fq-buy-button.is-visible {
  display: block;
}

.fq-buy-button:hover {
  background: #10a709;
  color: #ffffff;
}

@keyframes fqBuyPulse {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(18, 184, 11, 0.45);
  }

  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 14px rgba(18, 184, 11, 0);
  }
}
`;

const QUIZ_HTML = `
<div id="frequency-quiz" data-final-url="COLOQUE_AQUI_O_LINK_FINAL">
  <div class="fq-top-progress">
    <div class="fq-top-progress-fill" style="width: 12.5%;"></div>
  </div>

  <!-- ETAPA 1: G&Ecirc;NERO -->
  <section class="fq-stage fq-stage-intro is-active" data-step="0">
    <div class="fq-intro-content">

      <h1 class="fq-intro-title">
        En solo 30 segundos, descubre cómo tu nombre rige tu vibración
        y ve cómo alinear tu energía con la
        <span>prosperidad</span>!
      </h1>

      <div class="fq-warning">
        <div class="fq-warning-icon">⚠️</div>

        <div>
          <strong>Atención:</strong>
          ¡Si todo empieza a fluir después de la prueba, me debes una
          transferencia de $5!
        </div>
      </div>

      <h2 class="fq-question fq-gender-question">
        Selecciona tu género para iniciar la prueba.
      </h2>

      <div class="fq-gender-grid">
        <button type="button" class="fq-gender-card fq-option" data-field="gender" data-value="Mujer" data-next="1">
          <img src="/img/female.webp" alt="Mujer" class="lcp-img" width="230" height="269" fetchpriority="high" decoding="async">

          <span class="fq-gender-label">&gt;&nbsp; Mujer</span>
        </button>

        <button type="button" class="fq-gender-card fq-option" data-field="gender" data-value="Hombre" data-next="1">
          <img src="/img/masculine.webp" alt="Hombre" class="lcp-img" width="230" height="269" fetchpriority="high" decoding="async">

          <span class="fq-gender-label">&gt;&nbsp; Hombre</span>
        </button>
      </div>

      <div class="fq-privacy">
        <div class="fq-privacy-main">
          <div class="fq-lock">🔒</div>

          <strong>
            Privacidad<br>
            Garantizada:
          </strong>

          <span>
            Tus respuestas son 100% anónimas y<br class="fq-desktop-break">
            confidenciales.
          </span>
        </div>

        <p>
          Más de 98.342 personas ya han descubierto sus bloqueos a través
          de esta prueba.
        </p>
      </div>

    </div>
  </section>

  <!-- ETAPA 2: M&Ecirc;S -->
  <section class="fq-stage" data-step="1">
    <div class="fq-standard-content fq-month-content">

      <h2 class="fq-question">
        Haz clic en el mes en que naciste:
      </h2>

      <div class="fq-month-grid">
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Enero" data-next="2">Enero</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Febrero" data-next="2">Febrero</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Marzo" data-next="2">Marzo</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Abril" data-next="2">Abril</button>

        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Mayo" data-next="2">Mayo</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Junio" data-next="2">Junio</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Julio" data-next="2">Julio</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Agosto" data-next="2">Agosto</button>

        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Septiembre" data-next="2">Septiembre</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Octubre" data-next="2">Octubre</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Noviembre" data-next="2">Noviembre</button>
        <button class="fq-white-option fq-option" type="button" data-field="month" data-value="Diciembre" data-next="2">Diciembre</button>
      </div>

      <button type="button" class="fq-back" data-back="0">
        &lt; Volver
      </button>

    </div>
  </section>

  <!-- ETAPA 3: DIA -->
  <section class="fq-stage" data-step="2">
    <div class="fq-standard-content fq-day-content">

      <h2 class="fq-question">
        Indica el Día de tu Nacimiento:
      </h2>

      <div class="fq-day-grid" id="fq-days"></div>

      <button type="button" class="fq-back" data-back="1">
        &lt; Volver
      </button>

    </div>
  </section>

  <!-- ETAPA 4: D&Eacute;CADA -->
  <section class="fq-stage" data-step="3">
    <div class="fq-standard-content fq-decade-content">

      <h2 class="fq-question">
        ¿En qué Década naciste?
      </h2>

      <div class="fq-decade-grid">
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1910" data-next="4">1910</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1920" data-next="4">1920</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1930" data-next="4">1930</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1940" data-next="4">1940</button>

        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1950" data-next="4">1950</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1960" data-next="4">1960</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1970" data-next="4">1970</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1980" data-next="4">1980</button>

        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="1990" data-next="4">1990</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="2000" data-next="4">2000</button>
        <button class="fq-white-option fq-option" type="button" data-field="decade" data-value="2010" data-next="4">2010</button>
      </div>

      <button type="button" class="fq-back" data-back="2">
        &lt; Volver
      </button>

    </div>
  </section>

  <!-- ETAPA 5: ANO -->
  <section class="fq-stage" data-step="4">
    <div class="fq-standard-content fq-year-content">

      <h2 class="fq-question">
        ¿En qué Año naciste?
      </h2>

      <div class="fq-year-grid" id="fq-years"></div>

      <button type="button" class="fq-back" data-back="3">
        &lt; Volver
      </button>

    </div>
  </section>

  <!-- ETAPA 6: ESTADO CIVIL -->
  <section class="fq-stage" data-step="5">
    <div class="fq-standard-content fq-card-step">

      <h2 class="fq-gold-heading">
        ¿CUÁL ES TU ESTADO CIVIL?
      </h2>

      <div class="fq-marital-grid">

        <button class="fq-large-card fq-option" type="button" data-field="maritalStatus" data-value="Casado(a)" data-next="6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="handshake" aria-hidden="true" class="lucide lucide-handshake"><path d="m11 17 2 2a1 1 0 1 0 3-3"></path><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"></path><path d="m21 3 1 11h-2"></path><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"></path><path d="M3 4h8"></path></svg>
          <span>Casado(a)</span>
        </button>

        <button class="fq-large-card fq-option" type="button" data-field="maritalStatus" data-value="En una relación" data-next="6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="heart" aria-hidden="true" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span>En una relación</span>
        </button>

        <button class="fq-large-card fq-option" type="button" data-field="maritalStatus" data-value="Comprometido(a)" data-next="6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="gem" aria-hidden="true" class="lucide lucide-gem"><path d="M6 3h12l4 6-10 13L2 9Z"></path><path d="M11 3 8 9l4 13 4-13-3-6"></path><path d="M2 9h20"></path></svg>
          <span>Comprometido(a)</span>
        </button>

        <button class="fq-large-card fq-option" type="button" data-field="maritalStatus" data-value="Soltero(a)" data-next="6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="heart" aria-hidden="true" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span>Soltero(a)</span>
        </button>

        <button class="fq-large-card fq-option" type="button" data-field="maritalStatus" data-value="Separado(a)" data-next="6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="puzzle" aria-hidden="true" class="lucide lucide-puzzle"><path d="M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"></path></svg>
          <span>Separado(a)</span>
        </button>

        <button class="fq-large-card fq-option" type="button" data-field="maritalStatus" data-value="Viudo(a)" data-next="6">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="heart-crack" aria-hidden="true" class="lucide lucide-heart-crack"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="m12 13-1-1 2-2-3-3 2-2"></path></svg>
          <span>Viudo(a)</span>
        </button>

      </div>

      <button type="button" class="fq-back" data-back="4">
        &lt; Volver
      </button>

    </div>
  </section>

  <!-- ETAPA 7: DESAFIO -->
  <section class="fq-stage" data-step="6">
    <div class="fq-standard-content fq-card-step">

      <h2 class="fq-gold-heading fq-challenge-heading">
        ¿CUÁL ES EL MAYOR DESAFÍO DE TU<br>
        VIDA EN ESTE MOMENTO?
      </h2>

      <div class="fq-challenge-grid">

        <button class="fq-challenge-card fq-option" type="button" data-field="challenge" data-value="Vida Amorosa" data-next="7">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="heart-handshake" aria-hidden="true" class="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"></path><path d="m18 15-2-2"></path><path d="m15 18-2-2"></path></svg>
          <span>Vida Amorosa</span>
        </button>

        <button class="fq-challenge-card fq-option" type="button" data-field="challenge" data-value="Finanzas" data-next="7">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="badge-dollar-sign" aria-hidden="true" class="lucide lucide-badge-dollar-sign"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><path d="M12 18V6"></path></svg>
          <span>Finanzas</span>
        </button>

        <button class="fq-challenge-card fq-option" type="button" data-field="challenge" data-value="Salud" data-next="7">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="heart-pulse" aria-hidden="true" class="lucide lucide-heart-pulse"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"></path></svg>
          <span>Salud</span>
        </button>

        <button class="fq-challenge-card fq-option" type="button" data-field="challenge" data-value="Felicidad" data-next="7">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="sparkles" aria-hidden="true" class="lucide lucide-sparkles"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path><path d="M20 3v4"></path><path d="M22 5h-4"></path><path d="M4 17v2"></path><path d="M5 18H3"></path></svg>
          <span>Felicidad</span>
        </button>

      </div>

      <button type="button" class="fq-back" data-back="5">
        &lt; Volver
      </button>

    </div>
  </section>

  <!-- ETAPA 8: NOME -->
  <section class="fq-stage" data-step="7">
    <div class="fq-standard-content fq-name-content">

      <h2 class="fq-question">
        ¿Cuál es tu Primer Nombre?
      </h2>

      <input type="text" id="fq-first-name" class="fq-name-input" placeholder="Escribe tu nombre" autocomplete="given-name" maxlength="40">

      <div class="fq-name-error" id="fq-name-error">
        Escribe tu primer nombre para continuar.
      </div>

      <button type="button" class="fq-name-submit" id="fq-name-submit">
        ¡Haz clic aquí para continuar!
      </button>

    </div>
  </section>

  <!-- ETAPA 9: CARREGAMENTO -->
  <section class="fq-stage fq-dark-stage fq-loading-stage" data-step="8">
    <div class="fq-loading-content">

      <h2>Cargando tu lectura de frecuencia....</h2>

      <div class="fq-loading-bar">
        <div class="fq-loading-fill"></div>
      </div>

    </div>
  </section>

  <!-- ETAPA 10: TELA FINAL -->
  <section class="fq-stage fq-dark-stage fq-final-stage" data-step="9">
   <div class="fq-final-box">

  <!-- CONTE&Uacute;DO INICIAL -->
  <div id="fq-final-intro">

    <h2 class="fq-final-title">
      <span id="fq-final-name">bianca</span>, tu lectura dejará de estar disponible<br>
      pronto.
    </h2>

    <img class="fq-stop-image lcp-img" src="/img/stop.webp" alt="Atención" width="205" height="205" loading="lazy" decoding="async">

    <p class="fq-final-message">
      Esta es tu última oportunidad de ver hasta el final.<br>
      Haz clic en el botón de abajo...
    </p>

    <button type="button" class="fq-final-button" id="fq-final-button">
      COMENZAR
    </button>

  </div>

  <!-- V&Iacute;DEO -->
<div id="fq-vsl-area" aria-hidden="true">

  <div id="fq-player-mount"></div>

<a href="https://pay.hotmart.com/V106779085M?off=ch5t1mx8&amp;xcod=49959090&amp;external_code=49959090&amp;bid=1785178384973" class="fq-buy-button" id="fq-buy-button">
  Comprar ahora
</a>

</div>

</div>
  </section>
</div>
`;

export default function GuiaVibracionalQuizz() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const root = container.querySelector<HTMLElement>("#frequency-quiz");
    if (!root || root.dataset.initialized === "true") {
      return;
    }

    root.dataset.initialized = "true";

    const LOADING_TIME = 5000;

    const answers = {
      gender: "",
      month: "",
      day: "",
      decade: "",
      year: "",
      maritalStatus: "",
      challenge: "",
      firstName: "",
    };

    const stages = Array.from(root.querySelectorAll<HTMLElement>(".fq-stage"));
    const progressFill = root.querySelector<HTMLElement>(".fq-top-progress-fill")!;
    const daysContainer = root.querySelector<HTMLElement>("#fq-days")!;
    const yearsContainer = root.querySelector<HTMLElement>("#fq-years")!;
    const nameInput = root.querySelector<HTMLInputElement>("#fq-first-name")!;
    const nameSubmit = root.querySelector<HTMLButtonElement>("#fq-name-submit")!;
    const nameError = root.querySelector<HTMLElement>("#fq-name-error")!;
    const loadingStage = root.querySelector<HTMLElement>(".fq-loading-stage")!;
    const finalName = root.querySelector<HTMLElement>("#fq-final-name")!;
    const finalButton = root.querySelector<HTMLButtonElement>("#fq-final-button")!;
    const finalIntro = root.querySelector<HTMLElement>("#fq-final-intro")!;
    const vslArea = root.querySelector<HTMLElement>("#fq-vsl-area")!;
    const finalBox = root.querySelector<HTMLElement>(".fq-final-box")!;
    const playerMount = root.querySelector<HTMLElement>("#fq-player-mount")!;

    let currentStep = 0;
    let loadingTimer: ReturnType<typeof setTimeout> | null = null;

    function preloadImages() {
      [
        "/img/stop.webp",
        "/img/bg_divino.webp",
      ].forEach(function (url) {
        const image = new Image();
        image.src = url;
      });
    }

    function createDays() {
      daysContainer.innerHTML = "";

      const fragment = document.createDocumentFragment();

      for (let day = 1; day <= 31; day++) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "fq-white-option fq-option";
        button.dataset.field = "day";
        button.dataset.value = String(day).padStart(2, "0");
        button.dataset.next = "3";
        button.textContent = String(day).padStart(2, "0");

        fragment.appendChild(button);
      }

      daysContainer.appendChild(fragment);
    }

    function createYears(decade: string) {
      yearsContainer.innerHTML = "";

      const initialYear = Number(decade);
      const fragment = document.createDocumentFragment();

      for (let year = initialYear; year <= initialYear + 9; year++) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "fq-white-option fq-option";
        button.dataset.field = "year";
        button.dataset.value = String(year);
        button.dataset.next = "5";
        button.textContent = String(year);

        fragment.appendChild(button);
      }

      yearsContainer.appendChild(fragment);
    }

    function updateProgress(step: number) {
      let percentage;

      if (step <= 7) {
        percentage = ((step + 1) / 8) * 100;
      } else {
        percentage = 100;
      }

      progressFill.style.width = percentage + "%";
    }

    function showStep(step: number) {
      currentStep = Number(step);

      stages.forEach(function (stage) {
        const stageStep = Number(stage.dataset.step);
        stage.classList.toggle("is-active", stageStep === currentStep);
      });

      updateProgress(currentStep);

      root!.scrollTop = 0;

      if (currentStep === 7) {
        setTimeout(function () {
          nameInput.focus();
        }, 300);
      }

      if (currentStep === 8) {
        startLoading();
      }
    }

    function handleOption(button: HTMLElement) {
      const field = button.dataset.field;
      const value = button.dataset.value ?? "";
      const nextStep = Number(button.dataset.next);

      if (field) {
        (answers as Record<string, string>)[field] = value;
      }

      if (field === "decade") {
        answers.year = "";
        createYears(value);
      }

      showStep(nextStep);
    }

    function submitName() {
      const firstName = nameInput.value.trim();

      if (firstName.length < 2) {
        nameError.classList.add("is-visible");
        nameInput.focus();
        return;
      }

      nameError.classList.remove("is-visible");
      answers.firstName = firstName;

      finalName.textContent = firstName.toLocaleLowerCase("es");
      showStep(8);
    }

    function startLoading() {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }

      loadingStage.classList.remove("is-loading");

      const loadingFill = loadingStage.querySelector<HTMLElement>(".fq-loading-fill")!;
      loadingFill.style.transition = "none";
      loadingFill.style.width = "0";

      void loadingStage.offsetWidth;

      requestAnimationFrame(function () {
        loadingFill.style.transition = "width " + LOADING_TIME + "ms linear";

        loadingStage.classList.add("is-loading");
        loadingFill.style.width = "100%";
      });

      loadingTimer = setTimeout(function () {
        showStep(9);
      }, LOADING_TIME);
    }

    function onRootClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const option = target.closest<HTMLElement>(".fq-option");
      const backButton = target.closest<HTMLElement>("[data-back]");

      if (option && root!.contains(option)) {
        handleOption(option);
        return;
      }

      if (backButton && root!.contains(backButton)) {
        showStep(Number(backButton.dataset.back));
      }
    }

    function onNameInput() {
      if (nameInput.value.trim().length >= 2) {
        nameError.classList.remove("is-visible");
      }
    }

    function onNameKeydown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
        submitName();
      }
    }

    root.addEventListener("click", onRootClick);
    nameSubmit.addEventListener("click", submitName);
    nameInput.addEventListener("input", onNameInput);
    nameInput.addEventListener("keydown", onNameKeydown);

    const SECONDS_TO_DISPLAY = 1112;

    let vturbPlayerLoaded = false;

    function loadVturbPlayer() {
      if (vturbPlayerLoaded) {
        return;
      }

      vturbPlayerLoaded = true;

      const player = document.createElement("vturb-smartplayer") as HTMLElement & {
        displayHiddenElements?: (
          seconds: number,
          selectors: string[],
          options: { persist: boolean }
        ) => void;
      };

      player.id = "vid-6a5a2625ce2f01c3a2a21f82";

      player.setAttribute(
        "style",
        "display:block; margin:0 auto; width:100%; max-width:400px;"
      );

      player.setAttribute(
        "custom-config",
        '{"smartAutoPlay":{"backgroundProbe":{"enabled":false}}}'
      );

      const placeholder = document.createElement("div");

      placeholder.className = "vturb-player-placeholder";

      placeholder.setAttribute(
        "style",
        "position:relative; width:100%; padding:148.14814814814815% 0 0; z-index:0; background-color:black;"
      );

      player.appendChild(placeholder);

      /*
       * O botão "Comprar ahora" aparecerá quando o vídeo
       * chegar aos segundos reproduzidos definidos em SECONDS_TO_DISPLAY.
       */
      player.addEventListener("player:ready", function () {
        player.displayHiddenElements?.(SECONDS_TO_DISPLAY, ["#fq-buy-button"], {
          persist: true,
        });
      });

      playerMount.appendChild(player);

      const vturbScriptUrl =
        "https://scripts.converteai.net/d4622977-5c1b-4ced-962b-a0739fd35c0b/players/6a5a2625ce2f01c3a2a21f82/v4/player.js";

      const existingScript = document.querySelector(
        'script[src*="6a5a2625ce2f01c3a2a21f82/v4/player.js"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");

        script.src = vturbScriptUrl;
        script.async = true;

        document.head.appendChild(script);
      }
    }

    function onFinalButtonClick() {
      /* Esconde título, mão, mensagem e botão COMENZAR. */
      finalIntro.style.display = "none";

      /* Mostra a área que receberá o vídeo. */
      vslArea.classList.add("is-visible");
      vslArea.setAttribute("aria-hidden", "false");

      finalBox.classList.add("is-video-active");

      /* Insere e carrega o VTurb após o clique. */
      loadVturbPlayer();

      setTimeout(function () {
        window.dispatchEvent(new Event("resize"));

        vslArea.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }

    finalButton.addEventListener("click", onFinalButtonClick);

    // Encaminha os parâmetros de rastreamento do Facebook (UTMs, xcod, sck etc.)
    // que chegaram na URL para o link de checkout, garantindo a atribuição da venda.
    function forwardParamsToCheckout() {
      const incoming = new URLSearchParams(window.location.search);
      if (Array.from(incoming.entries()).length === 0) {
        return;
      }

      const link = root!.querySelector<HTMLAnchorElement>("#fq-buy-button");
      if (!link) {
        return;
      }

      const url = new URL(link.getAttribute("href")!, window.location.origin);
      const forwardedParameters: Array<{ key: string; value: string }> = [];

      const normalizeValue = (value: string) => {
        const trimmed = value.trim();
        if (!trimmed) {
          return trimmed;
        }

        return trimmed.replace(/\s+/g, " ");
      };

      incoming.forEach(function (value, key) {
        const normalizedKey = key.trim().toLowerCase();
        const normalizedValue = normalizeValue(value);
        const shouldForward =
          normalizedKey === "xcod" ||
          normalizedKey === "sck" ||
          normalizedKey === "external_code" ||
          normalizedKey === "bid" ||
          normalizedKey === "fbclid" ||
          normalizedKey.startsWith("utm_") ||
          normalizedKey.startsWith("fb");

        if (!shouldForward || !normalizedValue) {
          return;
        }

        url.searchParams.set(normalizedKey, normalizedValue);
        forwardedParameters.push({ key: normalizedKey, value: normalizedValue });
      });

      if (forwardedParameters.length > 0) {
        console.info(
          "[GuiaVibracional] Parâmetros de rastreamento encaminhados para o checkout:",
          forwardedParameters
        );
        link.setAttribute("href", url.toString());
      }
    }

    createDays();
    preloadImages();
    forwardParamsToCheckout();
    updateProgress(0);

    return () => {
      if (loadingTimer) {
        clearTimeout(loadingTimer);
      }

      root.removeEventListener("click", onRootClick);
      nameSubmit.removeEventListener("click", submitName);
      nameInput.removeEventListener("input", onNameInput);
      nameInput.removeEventListener("keydown", onNameKeydown);
      finalButton.removeEventListener("click", onFinalButtonClick);

      delete root.dataset.initialized;
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: QUIZ_CSS }} />
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: QUIZ_HTML }} />
    </>
  );
}
